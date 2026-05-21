import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuoteRepository } from './quote.repository';
import { CreateQuoteDto, UpdateQuoteDto, FilterQuoteDto } from './dto';
import { Quote, QuoteItem, QuoteStatus } from './entities';
import { QuoteItemType } from './entities/quote-item.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../lib/common/enums/roles.enum';
import {
  Structure,
  SolarPanel,
  Inverter,
  Battery,
  ServiceItem,
  ElectricalItem,
  MiscItem,
} from '../products/entities';

@Injectable()
export class QuoteService {
  constructor(
    private readonly quoteRepository: QuoteRepository,
    @InjectRepository(Structure)   private readonly structureRepo: Repository<Structure>,
    @InjectRepository(SolarPanel)  private readonly solarPanelRepo: Repository<SolarPanel>,
    @InjectRepository(Inverter)    private readonly inverterRepo: Repository<Inverter>,
    @InjectRepository(Battery)     private readonly batteryRepo: Repository<Battery>,
    @InjectRepository(ServiceItem) private readonly serviceItemRepo: Repository<ServiceItem>,
    @InjectRepository(ElectricalItem) private readonly electricalItemRepo: Repository<ElectricalItem>,
    @InjectRepository(MiscItem)    private readonly miscItemRepo: Repository<MiscItem>,
    @InjectRepository(QuoteItem)   private readonly quoteItemRepo: Repository<QuoteItem>,
  ) { }

  private async backfillDescriptions(quote: Quote): Promise<void> {
    const stale = quote.items?.filter((i) => !i.itemDescription) ?? [];
    if (!stale.length) return;

    const repoMap: Record<string, Repository<any>> = {
      [QuoteItemType.STRUCTURE]:  this.structureRepo,
      [QuoteItemType.SOLAR_PANEL]: this.solarPanelRepo,
      [QuoteItemType.INVERTER]:   this.inverterRepo,
      [QuoteItemType.BATTERY]:    this.batteryRepo,
      [QuoteItemType.SERVICE]:    this.serviceItemRepo,
      [QuoteItemType.ELECTRICAL]: this.electricalItemRepo,
      [QuoteItemType.MISC_ITEM]:  this.miscItemRepo,
    };

    await Promise.all(
      stale.map(async (item) => {
        const repo = repoMap[item.itemType];
        if (!repo) return;
        const product = await repo.findOne({ where: { id: item.itemId } });
        if (product?.description) {
          item.itemDescription = product.description;
          await this.quoteItemRepo.update(item.id, { itemDescription: product.description });
        }
      }),
    );
  }

  async create(createQuoteDto: CreateQuoteDto, user: User): Promise<Quote> {
    // Calculate totals
    let totalAmount = 0;
    const items: Partial<QuoteItem>[] = createQuoteDto.items.map((item) => {
      const itemTotal = item.unitPrice * item.quantity;
      totalAmount += itemTotal;
      return {
        itemType: item.itemType,
        itemId: item.itemId,
        itemName: item.itemName,
        itemDescription: item.itemDescription,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        totalPrice: itemTotal,
        brandName: item.brandName,
      };
    });

    const discountPercentage = createQuoteDto.discountPercentage || 0;
    const discountAmount = (totalAmount * discountPercentage) / 100;
    const finalAmount = totalAmount - discountAmount;
    const profitAmount = createQuoteDto.profitAmount ?? 0;

    const quote = this.quoteRepository.createInstance({
      customerName: createQuoteDto.customerName,
      customerPhone: createQuoteDto.customerPhone,
      customerEmail: createQuoteDto.customerEmail,
      customerAddress: createQuoteDto.customerAddress,
      totalAmount,
      discountPercentage,
      discountAmount,
      finalAmount,
      profitAmount,
      notes: createQuoteDto.notes,
      systemSize: createQuoteDto.systemSize,
      validUntil: createQuoteDto.validUntil
        ? new Date(createQuoteDto.validUntil)
        : undefined,
      createdById: user.id,
      status: createQuoteDto.status ?? QuoteStatus.DRAFT,
      items: [],
    });

    // IMPORTANT: `Quote.items` is the inverse side of the relation. The owning side is `QuoteItem.quote`.
    // Set the owning side so TypeORM correctly persists `quoteId` during cascade inserts.
    //
    // Also: avoid circular JSON (`quote.items[i].quote === quote`) by making `quote` non-enumerable.
    quote.items = items.map((item) => {
      const quoteItem = { ...item } as QuoteItem & { quote?: Quote };
      Object.defineProperty(quoteItem, 'quote', {
        value: quote,
        enumerable: false,
        writable: true,
      });
      return quoteItem as QuoteItem;
    });

    return this.quoteRepository.create(quote) as Promise<Quote>;
  }

  async findAll(filterDto: FilterQuoteDto, user: User) {
    const { page = 1, limit = 10, status, salesUserId, roleFilter } = filterDto;

    // Admins can see all quotes, sales users can only see their own
    if (user.role === UserRole.ADMIN) {
      return this.quoteRepository.findAllForAdmin(
        page,
        limit,
        status,
        salesUserId,
        roleFilter
      );
    }

    return this.quoteRepository.findByUserId(user.id!, page, limit, status);
  }

  async findOne(id: string, user: User): Promise<Quote> {
    const quote = await this.quoteRepository.findWithItems(id);

    if (!quote) {
      throw new NotFoundException('Quote not found');
    }

    // Check if user has access to this quote
    if (user.role !== UserRole.ADMIN && quote.createdById !== user.id) {
      throw new ForbiddenException('You do not have access to this quote');
    }

    await this.backfillDescriptions(quote);

    return quote;
  }

  async update(
    id: string,
    updateQuoteDto: UpdateQuoteDto,
    user: User,
  ): Promise<Quote> {
    const quote = await this.findOne(id, user);

    // Recalculate totals if items are updated
    if (updateQuoteDto.items) {
      let totalAmount = 0;
      const items: Partial<QuoteItem>[] = updateQuoteDto.items.map((item) => {
        const itemTotal = item.unitPrice * item.quantity;
        totalAmount += itemTotal;
        return {
          itemType: item.itemType,
          itemId: item.itemId,
          itemName: item.itemName,
          itemDescription: item.itemDescription,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          totalPrice: itemTotal,
          brandName: item.brandName,
        };
      });

      const discountPercentage =
        updateQuoteDto.discountPercentage ?? quote.discountPercentage;
      const discountAmount = (totalAmount * discountPercentage) / 100;
      const finalAmount = totalAmount - discountAmount;
      const profitAmount = updateQuoteDto.profitAmount ?? quote.profitAmount ?? 0;

      Object.assign(quote, {
        ...updateQuoteDto,
        totalAmount,
        discountAmount,
        finalAmount,
        profitAmount,
        items: items.map((item) => {
          const quoteItem = { ...item } as QuoteItem & { quote?: Quote };
          Object.defineProperty(quoteItem, 'quote', {
            value: quote,
            enumerable: false,
            writable: true,
          });
          return quoteItem as QuoteItem;
        }),
        systemSize: updateQuoteDto.systemSize !== undefined ? updateQuoteDto.systemSize : quote.systemSize,
        validUntil: updateQuoteDto.validUntil
          ? new Date(updateQuoteDto.validUntil)
          : quote.validUntil,
      });
    } else {
      // Update without recalculating
      if (updateQuoteDto.discountPercentage !== undefined) {
        const discountAmount =
          (quote.totalAmount * updateQuoteDto.discountPercentage) / 100;
        const finalAmount = quote.totalAmount - discountAmount;
        const profitAmount = updateQuoteDto.profitAmount ?? quote.profitAmount ?? 0;
        Object.assign(quote, {
          ...updateQuoteDto,
          discountAmount,
          finalAmount,
          profitAmount,
          systemSize: updateQuoteDto.systemSize !== undefined ? updateQuoteDto.systemSize : quote.systemSize,
          validUntil: updateQuoteDto.validUntil
            ? new Date(updateQuoteDto.validUntil)
            : quote.validUntil,
        });
      } else {
        Object.assign(quote, updateQuoteDto);
      }
    }

    return this.quoteRepository.create(quote) as Promise<Quote>;
  }

  async updateStatus(
    id: string,
    status: QuoteStatus,
    user: User,
  ): Promise<Quote> {
    const quote = await this.findOne(id, user);
    quote.status = status;
    return this.quoteRepository.create(quote) as Promise<Quote>;
  }

  async remove(id: string, user: User): Promise<void> {
    const quote = await this.findOne(id, user);
    await this.quoteRepository.findAndSoftDelete({ id: quote.id });
  }
}
