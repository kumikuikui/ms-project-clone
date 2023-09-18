import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IGanttChart, IGanttChartHeader } from 'src/app/model/ganttChart';
import { GanttChartServiceService } from 'src/app/services/gantt-chart-service/gantt-chart-service.service';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import { Activity } from '../../model/ganttChart';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatSelect } from '@angular/material/select';
import { SelectBoxComponent } from '../select-box/select-box.component';
import { DateRangePickerComponent } from '../date-range-picker/date-range-picker.component';

@Component({
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss'],
})
export class GanttChartComponent implements OnInit, AfterViewInit {
  showGanttChart: boolean = false;
  zoom: number = 2;
  fontSizeArray: string[] = [
    'smaller',
    'small',
    'revert',
    'medium',
    'larger',
    'large',
  ];
  fontSize = {
    'font-size': this.fontSizeArray[this.zoom],
  };
  showLegend: boolean = true;
  checkAll: boolean = false;
  currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  ganttChartHeader: IGanttChartHeader[] = [
    { title: 'Activity', show: true },
    { title: 'Responsible', show: false },
    { title: 'Start Date', show: false },
    { title: 'End Date', show: false },
    { title: 'Days', show: false },
    { title: 'Progress', show: false },
  ];
  ganttChartActivity: Activity[] = [];
  ganttChart: IGanttChart = {
    header: this.ganttChartHeader,
    data: [],
  };
  milestone: any = [];
  ganttChartStatusFilter: string[] = [];
  statusFilterOrder: string[] = [
    'No Status',
    'On-Track',
    'Slight Delay',
    'Significant Delay',
    'Off-Track',
  ];
  dateRange = this.generateDateRange(
    new Date(2019, 0, 1),
    new Date(2023, 11, 31)
  );
  monthRange = this.generateMonthRange();
  yearRange = this.generateYearRange(
    new Date(2019, 0, 1),
    new Date(2023, 11, 31)
  );

  @ViewChild('scrollable') scrollbarRef!: NgScrollbar;
  @ViewChild('selectBox') selectFilter: SelectBoxComponent | undefined;
  @ViewChild('dateRangePicker') dateFilter:
    | DateRangePickerComponent
    | undefined;

  constructor(
    private ganttService: GanttChartServiceService,
    private route: ActivatedRoute
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // this.scrollToToday();
    }, 0);
  }

  ngOnInit(): void {
    // get url params
    let id = this.route.snapshot.paramMap.get('id') || '';
    // this.ganttService.getGanttData(id).pipe(map())
    this.ganttService.getGanttData(id).subscribe(
      (data) => {
        this.ganttChart.data = data;
        this.ganttChartActivity = data;
      },
      (error) => console.log(error),
      () => {
        // get min date from array
        let minDate = this.ganttChart.data.reduce(
          (min, p) => (p.startDate < min ? p.startDate : min),
          this.ganttChart.data[0].startDate
        );

        //get max date from array
        let maxDate = this.ganttChart.data.reduce(
          (max, p) => (p.endDate > max ? p.endDate : max),
          this.ganttChart.data[0].endDate
        );

        this.ganttChart.data.map((item) => {
          if (item.status === '1') {
            if (!this.ganttChartStatusFilter.includes('On-Track')) {
              this.ganttChartStatusFilter.push('On-Track');
            }
          } else if (item.status === '2') {
            if (!this.ganttChartStatusFilter.includes('Slight Delay')) {
              this.ganttChartStatusFilter.push('Slight Delay');
            }
          } else if (item.status === '3') {
            if (!this.ganttChartStatusFilter.includes('Significant Delay')) {
              this.ganttChartStatusFilter.push('Significant Delay');
            }
          } else if (item.status === '4') {
            if (!this.ganttChartStatusFilter.includes('Off-Track')) {
              this.ganttChartStatusFilter.push('Off-Track');
            }
          } else if (item.status === '') {
            if (!this.ganttChartStatusFilter.includes('No Status')) {
              this.ganttChartStatusFilter.push('No Status');
            }
          }
        });

        this.ganttChartStatusFilter.sort((a, b) => {
          return (
            this.statusFilterOrder.indexOf(a) -
            this.statusFilterOrder.indexOf(b)
          );
        });

        this.dateRange = this.generateDateRange(
          new Date(minDate),
          new Date(maxDate)
        );
        this.monthRange = this.generateMonthRange();
        this.yearRange = this.generateYearRange(
          new Date(minDate),
          new Date(maxDate)
        );

        this.showHideColumn(true, 'All');
      }
    );
  }

  scrollToToday() {
    let today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    let el: HTMLElement = document.getElementById(today) as HTMLElement;
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'end',
    });
    // this.scrollbarRef.viewport.nativeElement.scrollLeft += 200;
  }

  scroll(id: string) {
    let el: HTMLElement = document.getElementById(id) as HTMLElement;
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }

  moveLeft() {
    this.scrollbarRef.viewport.nativeElement.scrollLeft -= 200;
  }

  moveRight() {
    this.scrollbarRef.viewport.nativeElement.scrollLeft += 200;
  }

  moveToStart() {
    this.scrollbarRef.viewport.nativeElement.scrollLeft = 0;
  }

  moveToEnd() {
    let el: HTMLElement = document.getElementById(
      this.dateRange[this.dateRange.length - 1]
    ) as HTMLElement;
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'end',
    });
  }

  zoomIn() {
    if (this.zoom < 5) {
      this.zoom++;
    }
    this.fontSize = {
      'font-size': this.fontSizeArray[this.zoom],
    };
  }

  zoomOut() {
    if (this.zoom > 0) {
      this.zoom--;
    }
    this.fontSize = {
      'font-size': this.fontSizeArray[this.zoom],
    };
  }

  toggleLegend() {
    this.showLegend = !this.showLegend;
  }

  toggleGanttChart() {
    this.showGanttChart = !this.showGanttChart;
  }

  filterStatus(status: string) {
    if (status) {
      this.ganttChart.data = this.ganttChartActivity.filter((item) => {
        if (status === 'On-Track') {
          return item.status === '1';
        } else if (status === 'Slight Delay') {
          return item.status === '2';
        } else if (status === 'Significant Delay') {
          return item.status === '3';
        } else if (status === 'Off-Track') {
          return item.status === '4';
        } else if (status === 'No Status') {
          return item.status === '';
        } else {
          return item;
        }
      });
    } else {
      this.ganttChart.data = this.ganttChartActivity;
    }
  }

  filterDateRange(dateRange: any) {
    if (dateRange.start && dateRange.end) {
      this.dateRange = this.generateDateRange(
        new Date(dateRange.start),
        new Date(dateRange.end)
      );
      this.monthRange = this.generateMonthRange();
      this.yearRange = this.generateYearRange(
        new Date(dateRange.start),
        new Date(dateRange.end)
      );

      this.ganttChart.data = this.ganttChartActivity.filter((item) => {
        return (
          new Date(item.startDate) >= new Date(dateRange.start) &&
          new Date(item.endDate) <= new Date(dateRange.end)
        );
      });
    }
  }

  resetFilter() {
    this.ganttChart.data = this.ganttChartActivity;
    this.dateRange = this.generateDateRange(
      new Date(this.ganttChart.data[0].startDate),
      new Date(this.ganttChart.data[0].endDate)
    );
    this.monthRange = this.generateMonthRange();
    this.yearRange = this.generateYearRange(
      new Date(this.ganttChart.data[0].startDate),
      new Date(this.ganttChart.data[0].endDate)
    );
    this.filterStatus('');
    this.selectFilter?.selectControl.setValue('');
    this.dateFilter?.range.setValue({
      start: '',
      end: '',
    });
  }

  showHideColumn(column: boolean, title: string) {
    if (title === 'All') {
      this.checkAll = !this.checkAll;
      this.ganttChart.header.map((item) => {
        item.show = true;
      });
    } else if (title === 'Hide') {
      this.checkAll = !this.checkAll;
      this.ganttChart.header.map((item) => {
        if (item.title !== 'Activity') {
          item.show = false;
        }
      });
    } else {
      this.ganttChart.header.map((item) => {
        if (item.title === title) {
          item.show = column;
        }
      });
    }
  }

  expandAll() {
    this.ganttChart.data.map((item) => {
      item.expand = true;
    });
  }

  collapseAll() {
    this.ganttChart.data.map((item) => {
      item.expand = false;
    });
  }

  //generate date range 1990-01-01 to 2020-01-01
  generateDateRange(startDate: Date, endDate: Date) {
    const dateArray = [];
    const currentDate = startDate;
    while (currentDate <= endDate) {
      dateArray.push(formatDate(new Date(currentDate), 'yyyy-MM-dd', 'en'));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  }

  //generate month range 1990-01-01 to 2020-01-01
  generateMonthRange() {
    const monthArray = [];
    const endDate = new Date(
      this.dateRange.sort((a, b) => {
        return new Date(b).getTime() - new Date(a).getTime();
      })[0]
    );
    const currentDate = new Date(
      this.dateRange.sort((a, b) => {
        return new Date(a).getTime() - new Date(b).getTime();
      })[0]
    );

    if (currentDate.getDate() < endDate.getDate()) {
      while (currentDate <= endDate) {
        let month = {
          name: formatDate(new Date(currentDate), 'MMMM yyyy', 'en'),
          date: formatDate(new Date(currentDate), 'yyyy-MM-dd', 'en'),
        };
        monthArray.push(month);
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    } else {
      while (currentDate <= endDate) {
        let month = {
          name: formatDate(new Date(currentDate), 'MMMM yyyy', 'en'),
          date: formatDate(new Date(currentDate), 'yyyy-MM-dd', 'en'),
        };
        monthArray.push(month);
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      monthArray.push({
        name: formatDate(new Date(endDate), 'MMMM yyyy', 'en'),
        date: formatDate(new Date(endDate), 'yyyy-MM-dd', 'en'),
      });
    }
    return monthArray;
  }

  //get the first date of the month and the last date of the month
  getFirstAndLastDateOfMonth(date: Date) {
    const firstDate = formatDate(
      new Date(date.getFullYear(), date.getMonth(), 1),
      'yyyy-MM-dd',
      'en'
    );
    const lastDate = formatDate(
      new Date(date.getFullYear(), date.getMonth() + 1, 0),
      'yyyy-MM-dd',
      'en'
    );
    return [firstDate, lastDate];
  }

  //generate month range 1990-01-01 to 2020-01-01
  generateYearRange(startDate: Date, endDate: Date) {
    const yearArray = [];
    const currentDate = startDate;
    while (currentDate <= endDate) {
      let year = {
        name: formatDate(new Date(currentDate), 'YYYY', 'en'),
        date: formatDate(new Date(currentDate), 'yyyy-MM-dd', 'en'),
      };
      yearArray.push(year);
      currentDate.setFullYear(currentDate.getFullYear() + 1);
    }
    return yearArray;
  }

  //get the first date of the month and the last date of the month
  getFirstAndLastDateOfYear(date: Date) {
    const firstDate = formatDate(
      new Date(date.getFullYear(), 0, 1),
      'yyyy-MM-dd',
      'en'
    );
    const lastDate = formatDate(
      new Date(date.getFullYear(), 11, 31),
      'yyyy-MM-dd',
      'en'
    );
    return [firstDate, lastDate];
  }

  //find date array index
  findDateIndex(date: string) {
    return this.dateRange.indexOf(date);
  }

  //calculate the number of days between two dates
  getDaysBetweenDates(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays ? diffDays : 1;
  }

  generateYAxisLabel(columns: number) {
    return {
      display: 'grid',
      'grid-template-columns': `repeat(${columns}, 1fr)`,
    };
  }

  generateColumn(columns: number) {
    return {
      display: 'grid',
      'grid-template-columns': `repeat(${columns}, 2em)`,
    };
  }

  renderYear(date: string) {
    let range = this.getFirstAndLastDateOfYear(new Date(date));
    let start = this.findDateIndex(range[0]) + 1;
    let end = this.findDateIndex(range[1]) + 2;
    return {
      'grid-column': `${start ? start : 1}/${end}`,
    };
  }

  renderMonth(date: string) {
    let range = this.getFirstAndLastDateOfMonth(new Date(date));
    let start = this.findDateIndex(range[0]) + 1;
    let end =
      this.findDateIndex(range[1]) === -1
        ? this.dateRange.length + 1
        : this.findDateIndex(range[1]) + 2;
    return {
      'grid-column': `${start ? start : 1}/${end}`,
    };
  }

  renderRow(dateFrom: string, dateTo: string) {
    let start = this.findDateIndex(dateFrom) + 1;
    let end = this.findDateIndex(dateTo) + 2;
    return {
      'grid-column': `${start ? start : 1}/${end}`,
    };
  }

  collapse(row: any) {
    this.ganttChart.data.forEach((item) => {
      if (item.id === row.id) {
        item.expand = !item.expand;
      }
    });
  }
}
