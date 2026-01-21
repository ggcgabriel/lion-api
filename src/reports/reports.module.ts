import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service.js';
import { EmployeesModule } from '../employees/employees.module.js';

@Module({
  imports: [EmployeesModule],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
