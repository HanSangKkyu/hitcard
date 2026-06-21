export type RootStackParamList = {
  LoginScreen: undefined;
  JoinScreen: undefined;
  MyProblemSetScreen: undefined;
  CategoryScreen: { problemSetSN: string; problemSetName: string };
  ProblemScreen: { categorySN: string; categoryName: string; problemSet: string; category: CategoryData[] };
  SolveScreen: { selectedItem: string[]; category: CategoryData[]; problemSetSN: string };
  AddProblemScreen: { categorySN: string; problemSet: string };
  EditProblemScreen: { SN: string; question: string; answer: string; category: string; hit: string; problemSet: string };
  SearchScreen: undefined;
  SearchCategoryScreen: { problemSetSN: string; problemSetName: string; problemSetHit: string };
  SearchCategoryProblemScreen: { categorySN: string; categoryName: string; problemSet: string; category: CategoryData[] };
  MakeScreen: undefined;
};

export interface ProblemSetData {
  SN: string;
  name: string;
  owner: string;
  tag: string;
  hit: string;
  created_data: string;
  modified_data: string;
  visible?: boolean;
}

export interface CategoryData {
  SN: string;
  name: string;
  problemSet: string;
  visible?: boolean;
}

export interface ProblemData {
  SN: string;
  question: string;
  answer: string;
  category: string;
  hit: string;
  visible?: boolean;
}
