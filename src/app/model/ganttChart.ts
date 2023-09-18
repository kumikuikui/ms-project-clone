export interface IGanttChart {
  header: IGanttChartHeader[];
  data: Activity[];
}

export interface IGanttChartHeader {
  title: string;
  show: boolean;
}

export interface Activity {
  id: string;
  activity: string;
  stage: string;
  status: string;
  startDate: string;
  endDate: string;
  progress: string;
  subActivity: SubActivity[];
  expand: boolean;
  remarks: string;
}

export interface SubActivity {
  id: string;
  activity: string;
  status: string;
  responsible: string;
  startDate: string;
  endDate: string;
  progress: string;
  remarks: string;
}


export const activity: Activity[] = [
  {
    id: '1',
    activity: 'Activity 1',
    stage: '1',
    status: '1',
    startDate: '2019-01-01',
    endDate: '2019-01-05',
    progress: '50%',
    expand: true,
    remarks: 'asdasdsad',
    subActivity: [
      {
        id: '1.1',
        activity: 'Sub Activity 1.1',
        status: '1',
        responsible: 'John Doe',
        startDate: '2019-01-01',
        endDate: '2019-01-05',
        progress: '50%',
        remarks: 'asdasd'
      },
      {
        id: '1.2',
        activity: 'Sub Activity 1.2',
        status: '1',
        responsible: 'John Doe',
        startDate: '2019-01-01',
        endDate: '2019-01-05',
        progress: '50%',
        remarks: 'asdasdasd'

      },
    ],
  },
  {
    id: '2',
    activity: 'Activity 2',
    stage: '2',
    status: '1',
    startDate: '2019-01-01',
    endDate: '2021-01-05',
    progress: '50%',
    expand: false,
    remarks: 'asdasdsad',
    subActivity: [
      {
        id: '1.1',
        activity: 'Sub Activity 2.1',
        status: '1',
        responsible: 'John Doe',
        startDate: '2019-01-01',
        endDate: '2021-01-05',
        progress: '50%',
        remarks: '',
      },
      {
        id: '1.2',
        activity: 'Sub Activity 2.2',
        status: '1',
        responsible: 'John Doe',
        startDate: '2019-01-01',
        endDate: '2021-01-05',
        progress: '50%',
        remarks: 'asdasds',
      },
    ],
  },
  {
    id: '3',
    activity: 'Activity 3',
    stage: '',
    status: '1',
    startDate: '2019-01-01',
    endDate: '2022-01-05',
    progress: '50%',
    expand: false,
    remarks: 'asdsadas',
    subActivity: [
      {
        id: '1.1',
        activity: 'Sub Activity 3.1',
        status: '1',
        responsible: 'John Doe',
        startDate: '2019-01-01',
        endDate: '2022-01-05',
        progress: '50%',
        remarks: 'asdasd',
      },
      {
        id: '1.2',
        activity: 'Sub Activity 3.2',
        status: '1',
        responsible: 'John Doe',
        startDate: '2019-01-01',
        endDate: '2022-01-05',
        progress: '50%',
        remarks: 'asdasd',
      },
    ],
  },
];