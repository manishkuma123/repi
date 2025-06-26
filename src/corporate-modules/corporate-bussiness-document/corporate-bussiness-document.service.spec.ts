import { Test, TestingModule } from '@nestjs/testing';
import { CorporateBussinessDocumentService } from './corporate-bussiness-document.service';

describe('CorporateBussinessDocumentService', () => {
  let service: CorporateBussinessDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CorporateBussinessDocumentService],
    }).compile();

    service = module.get<CorporateBussinessDocumentService>(CorporateBussinessDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
