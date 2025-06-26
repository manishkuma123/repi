import { Test, TestingModule } from '@nestjs/testing';
import { CorporateBussinessDocumentController } from './corporate-bussiness-document.controller';

describe('CorporateBussinessDocumentController', () => {
  let controller: CorporateBussinessDocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorporateBussinessDocumentController],
    }).compile();

    controller = module.get<CorporateBussinessDocumentController>(CorporateBussinessDocumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
