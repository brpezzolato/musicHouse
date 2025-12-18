import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

export async function gerarNotaFiscalPDF(
  dadosVenda,
  dadosFranquia,
  dadosFuncionario,
  itens,
  parcela
) {
  const pdf = await PDFDocument.create();

  // Configurações de layout
  const margin = 30;
  const pageWidth = 520;
  const headerSpace = 300; // Espaço reservado para o topo
  const footerSpace = 250; // Espaço reservado para o rodapé
  const rowHeight = 25; // Altura por linha de item

  // Calcula a altura total da página baseada na quantidade de itens (Estilo Cupom)
  const itemsHeight = itens.length * rowHeight;
  const pageHeight = headerSpace + itemsHeight + footerSpace;

  const page = pdf.addPage([pageWidth, pageHeight]);

  // Carregamento de fontes e cores
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const vermelho = rgb(193 / 255, 18 / 255, 31 / 255);
  const cinzaTexto = rgb(80 / 255, 80 / 255, 80 / 255);
  const preto = rgb(0, 0, 0);
  const white = rgb(1, 1, 1);

  // --- Funções Auxiliares ---

  // Desenha texto alinhado à direita (ideal para valores monetários)
  const drawTextRight = (text, xRight, y, size, fontToUse, color) => {
    const width = fontToUse.widthOfTextAtSize(text, size);
    page.drawText(text, { x: xRight - width, y, size, font: fontToUse, color });
  };

  // Desenha texto centralizado em um ponto X
  const drawTextCenter = (text, xCenter, y, size, fontToUse, color) => {
    const width = fontToUse.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: xCenter - width / 2,
      y,
      size,
      font: fontToUse,
      color,
    });
  };

  // Corta o texto e adiciona "..." se exceder a largura máxima
  const truncateText = (text, maxWidth, fontSize) => {
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    if (textWidth <= maxWidth) return text;

    let truncated = text;
    while (font.widthOfTextAtSize(truncated + '...', fontSize) > maxWidth) {
      truncated = truncated.slice(0, -1);
    }
    return truncated + '...';
  };

  // Quebra o texto em múltiplas linhas se exceder a largura
  const wrapText = (text, maxWidth, size = 12) => {
    const words = text.split(' ');
    const lines = [];
    let line = '';

    for (let w of words) {
      const test = line ? line + ' ' + w : w;
      if (font.widthOfTextAtSize(test, size) > maxWidth) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  };

  // --- Renderização do Conteúdo ---

  let y = pageHeight - 60; // Ponto inicial (topo)

  // Cabeçalho (Logo, Data, Título)
  const logoBytes = await fetch('/logos/CasaVermelha.png').then((r) =>
    r.arrayBuffer()
  );
  const logo = await pdf.embedPng(logoBytes);
  page.drawImage(logo, {
    x: margin,
    y: pageHeight - 110,
    width: 80,
    height: 80,
  });

  page.drawText(`Data: ${new Date().toLocaleDateString('pt-BR')}`, {
    x: pageWidth - 150,
    y: pageHeight - 60,
    size: 12,
    font: fontBold,
    color: preto,
  });

  y = pageHeight - 150;
  page.drawText('Nota Fiscal', {
    x: margin,
    y: y,
    size: 28,
    font: fontBold,
    color: preto,
  });

  // Informações da Venda
  let infoY = pageHeight - 120;
  const infoXRight = pageWidth - margin;

  const drawInfo = (label, value) => {
    const textWidth = font.widthOfTextAtSize(`${label} ${value}`, 11);
    const labelWidth = fontBold.widthOfTextAtSize(label, 11);

    page.drawText(label, {
      x: infoXRight - textWidth,
      y: infoY,
      size: 11,
      font: fontBold,
      color: preto,
    });

    page.drawText(value, {
      x: infoXRight - textWidth + labelWidth + 3,
      y: infoY,
      size: 11,
      font: font,
      color: cinzaTexto,
    });
    infoY -= 16;
  };

  drawInfo('ID Compra:', String(dadosVenda.idVenda));
  drawInfo(
    'Pagamento:',
    dadosVenda.formaPgto === 1
      ? 'Débito'
      : dadosVenda.formaPgto === 2
      ? 'Crédito'
      : 'Pix'
  );
  drawInfo('Local:', dadosFranquia.endereco_completo);
  drawInfo('Func Resp:', dadosFuncionario.nome_completo);

  // Tabela de Itens
  y = infoY - 40;

  page.drawRectangle({
    x: margin,
    y: y,
    width: pageWidth - margin * 2,
    height: 30,
    color: vermelho,
  });

  const yHeader = y + 10;
  const colSKU = margin + 10;
  const colDesc = margin + 70;
  const colPrecoRight = 360;
  const colQtdCenter = 400;
  const colTotalRight = pageWidth - margin - 10;

  page.drawText('SKU', {
    x: colSKU,
    y: yHeader,
    size: 12,
    color: white,
    font: fontBold,
  });
  page.drawText('Descrição', {
    x: colDesc,
    y: yHeader,
    size: 12,
    color: white,
    font: fontBold,
  });
  drawTextRight('Preço', colPrecoRight, yHeader, 12, fontBold, white);
  drawTextCenter('Qtd', colQtdCenter, yHeader, 12, fontBold, white);
  drawTextRight('Total', colTotalRight, yHeader, 12, fontBold, white);

  y -= rowHeight;

  // Renderização dos Itens
  itens.forEach((item) => {
    const nomeTruncado = truncateText(item.nome, 180, 11);

    page.drawText(String(item.sku), {
      x: colSKU,
      y: y,
      size: 11,
      font,
      color: cinzaTexto,
    });
    page.drawText(nomeTruncado, {
      x: colDesc,
      y: y,
      size: 11,
      font,
      color: cinzaTexto,
    });

    const preco = item.preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    drawTextRight(preco, colPrecoRight, y, 11, font, cinzaTexto);

    drawTextCenter(String(item.qtd), colQtdCenter, y, 11, font, cinzaTexto);

    
    const totalItem = (item.preco * item.qtd).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    drawTextRight(totalItem, colTotalRight, y, 11, font, cinzaTexto);

    y -= rowHeight;
  });

  // Totais (Posicionados logo após o último item)
  let yTotais = y - 20;

  if (parcela) {
    const parcelaText = `Parcelas: ${parcela}`;
    const parcelaWidth = font.widthOfTextAtSize(parcelaText, 12);
    page.drawText(parcelaText, {
      x: pageWidth - margin - parcelaWidth,
      y: yTotais,
      size: 12,
      font,
      color: cinzaTexto,
    });
    yTotais -= 20;
  }

  const totalLabel = 'Total:';
  const totalValue = dadosVenda.total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  const totalValueWidth = fontBold.widthOfTextAtSize(totalValue, 16);
  const totalLabelWidth = fontBold.widthOfTextAtSize(totalLabel, 16);

  page.drawText(totalValue, {
    x: pageWidth - margin - totalValueWidth,
    y: yTotais,
    size: 16,
    font: fontBold,
    color: vermelho,
  });

  page.drawText(totalLabel, {
    x: pageWidth - margin - totalValueWidth - totalLabelWidth - 5,
    y: yTotais,
    size: 16,
    font: fontBold,
    color: preto,
  });

  // Rodapé Fixo (Sempre nos últimos 100px da página calculada)
  const footerTop = 100;

  page.drawText('Termos e condições', {
    x: margin,
    y: footerTop,
    size: 14,
    font: fontBold,
    color: vermelho,
  });

  const termosLines = wrapText(
    'A Music House se responsabiliza até certo ponto, o resto é história, se vira mlk.',
    250,
    11
  );

  termosLines.forEach((line, i) => {
    page.drawText(line, {
      x: margin,
      y: footerTop - 20 - i * 14,
      size: 11,
      font,
      color: cinzaTexto,
    });
  });

  // Assinatura e Mensagem Final (Alinhado à direita no rodapé)
  const rightColumnX = pageWidth - margin;
  const drawFooterRight = (txt, yPos) => {
    const w = font.widthOfTextAtSize(txt, 11);
    page.drawText(txt, {
      x: rightColumnX - w,
      y: yPos,
      size: 11,
      font,
      color: preto,
    });
  };

  drawFooterRight('MUSIC HOUSE', footerTop);
  drawFooterRight('Responsável pela compra', footerTop - 18);
  drawFooterRight('Obrigado pela preferência!', footerTop - 36);

  const pdfBytes = await pdf.save();
  saveAs(new Blob([pdfBytes]), `Nota_Fiscal_${dadosVenda.idVenda}.pdf`);
}
