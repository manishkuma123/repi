export interface CreateHelperTrainingExamRequestDTO {
  session_id: string;
  tests: TestDTO[];
}

export interface TestDTO {
  test_id?: string;
  test_no: number;
  question: string;
  type: string;
  choices: ChoiceDTO[];
  answer: number;
}

export interface ChoiceDTO {
  id: number;
  choice: string;
}
