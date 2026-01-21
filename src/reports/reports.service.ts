import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EmployeesService } from '../employees/employees.service.js';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private employeesService: EmployeesService) {}

  @Cron('0 9 * * *', {
    name: 'dailyEmployeeReport',
    timeZone: 'America/Sao_Paulo',
  })
  async handleDailyReport() {
    this.logger.log('Starting daily employee report...');

    try {
      const activeCount = await this.employeesService.countActive();
      const reportDate = new Date().toLocaleDateString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      });

      this.logger.log('========================================');
      this.logger.log('       DAILY EMPLOYEE REPORT');
      this.logger.log('========================================');
      this.logger.log(`Date: ${reportDate}`);
      this.logger.log(`Active Employees: ${activeCount}`);
      this.logger.log('========================================');
      this.logger.log('[EMAIL SIMULATION] Report would be sent to admin@local.com');
      this.logger.log('Daily employee report completed successfully');
    } catch (error) {
      this.logger.error('Failed to generate daily report', error);
    }
  }

  // Manual trigger for testing
  async generateReport() {
    await this.handleDailyReport();
    return { message: 'Report generated successfully' };
  }
}
