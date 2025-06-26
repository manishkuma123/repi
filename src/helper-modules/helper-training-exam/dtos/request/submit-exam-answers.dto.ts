interface ExamAnswerDTO {
  test_id: string;
  answer: number;
}

export interface SubmitExamAnswersRequestDTO {
  session_id: string;
  main_job_id: string;
  sub_job_id: string;
  testWithAnswer: ExamAnswerDTO[];
}
