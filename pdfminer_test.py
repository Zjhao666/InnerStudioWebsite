
from pdfminer.pdfparser import PDFParser
from pdfminer.pdfdocument import PDFDocument
from pdfminer.pdfpage import PDFPage
from pdfminer.pdfinterp import PDFResourceManager,PDFPageInterpreter
from pdfminer.converter import PDFPageAggregator
from pdfminer.layout import LAParams
def handlePdf(path):
    with open(path,'rb') as fp:
        parser=PDFParser(fp)
        doc=PDFDocument(parser)
        parser.set_document(doc)
        pages=PDFPage.create_pages(doc)
        # parse
        rsrcmgr=PDFResourceManager()
        laparams=LAParams()
        device=PDFPageAggregator(rsrcmgr,laparams=laparams)
        interpreter=PDFPageInterpreter(rsrcmgr,device)
        for i,page in enumerate(pages):
            interpreter.process_page(page)
            layout=device.get_result()
            print layout

# handlePdf('/home/lijingwei/Downloads/LinuxIPC.pdf')
