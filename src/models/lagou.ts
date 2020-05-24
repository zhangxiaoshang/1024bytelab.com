import books from '@/mock/lagou-course-list.json';

export interface LagouTeacherProps {
  teacherName: string;
  position: string;
}

export interface DistributionBaseInfoVoProps {
  brokerage: string;
}
export interface DistributionDetailProps {
  url: string;
}
export interface LagouBookProps {
  _id: number;
  courseName: string;
  brief: string;
  courseListImg: string;
  teachers: LagouTeacherProps[];
  isNewDes: boolean;
  discounts: string;
  price: string;
  sales: string;
  distributionBaseInfoVo: DistributionBaseInfoVoProps;
  distributionDetail: DistributionDetailProps;
}
export interface LagouModelState {
  books: LagouBookProps[];
}
export interface LagouModelType {
  namespace: 'lagou';
  state: LagouModelState;
}

const LagouModel: LagouModelType = {
  namespace: 'lagou',

  state: {
    books: books,
  },
};

export default LagouModel;
