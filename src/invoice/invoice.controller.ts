import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller('api/invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) {}

    @Get(':orderId')
    getInvoice(@Param('orderId', ParseIntPipe) orderId: number) {
        return this.invoiceService.generateInvoice(orderId);
    }
}
