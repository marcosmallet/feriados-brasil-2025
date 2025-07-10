const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Carregar dados dos feriados
const nationalHolidays = JSON.parse(fs.readFileSync(path.join(__dirname, 'national_holidays_2025.json'), 'utf8'));
const stateHolidays = JSON.parse(fs.readFileSync(path.join(__dirname, 'state_holidays_2025.json'), 'utf8'));
const municipalHolidays = JSON.parse(fs.readFileSync(path.join(__dirname, 'municipal_holidays_2025.json'), 'utf8'));

// Combinar todos os feriados
const allHolidays = [...nationalHolidays, ...stateHolidays, ...municipalHolidays];

// Estados brasileiros
const ESTADOS = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

// Função para ordenar feriados por data
function sortHolidaysByDate(holidays) {
  return holidays.sort((a, b) => {
    const [diaA, mesA] = a.data.split("/");
    const [diaB, mesB] = b.data.split("/");
    const dataA = new Date(2025, parseInt(mesA) - 1, parseInt(diaA));
    const dataB = new Date(2025, parseInt(mesB) - 1, parseInt(diaB));
    return dataA - dataB;
  });
}

// Função para filtrar feriados
function filterHolidays(holidays, filters) {
  let filtered = [...holidays];

  // Filtro por mês
  if (filters.meses && filters.meses.length > 0) {
    filtered = filtered.filter((feriado) => {
      const [dia, mes] = feriado.data.split("/");
      return filters.meses.includes(mes);
    });
  }

  // Filtro por tipo
  if (filters.tipos && filters.tipos.length > 0) {
    filtered = filtered.filter((feriado) =>
      filters.tipos.includes(feriado.tipo)
    );
  }

  // Filtro por estado
  if (filters.estados && filters.estados.length > 0) {
    filtered = filtered.filter((feriado) => {
      if (feriado.tipo === "NACIONAL") return true;
      return filters.estados.includes(feriado.uf);
    });
  }

  // Filtro por nome (busca textual)
  if (filters.nome) {
    const searchTerm = filters.nome.toLowerCase();
    filtered = filtered.filter((feriado) =>
      feriado.nome.toLowerCase().includes(searchTerm) ||
      (feriado.descricao && feriado.descricao.toLowerCase().includes(searchTerm))
    );
  }

  // Filtro por data específica
  if (filters.data) {
    filtered = filtered.filter((feriado) => feriado.data === filters.data);
  }

  return sortHolidaysByDate(filtered);
}

// Rotas da API

// Rota principal - informações da API
app.get('/', (req, res) => {
  res.json({
    name: 'API Feriados Brasil 2025',
    version: '1.0.0',
    description: 'API para consulta de feriados nacionais, estaduais e municipais do Brasil em 2025',
    endpoints: {
      '/feriados': 'GET - Lista todos os feriados com filtros opcionais',
      '/feriados/nacionais': 'GET - Lista apenas feriados nacionais',
      '/feriados/estaduais': 'GET - Lista feriados estaduais (com filtro por UF)',
      '/feriados/municipais': 'GET - Lista feriados municipais (com filtro por UF)',
      '/feriados/data/:dia/:mes': 'GET - Busca feriados por data específica (formato: DD/MM)',
      '/estados': 'GET - Lista todos os estados brasileiros',
      '/stats': 'GET - Estatísticas dos feriados'
    },
    filters: {
      meses: 'Array de meses (01-12)',
      tipos: 'Array de tipos (NACIONAL, ESTADUAL, MUNICIPAL)',
      estados: 'Array de UFs dos estados',
      nome: 'String para busca textual no nome ou descrição',
      data: 'Data específica no formato DD/MM'
    }
  });
});

// Listar todos os feriados com filtros
app.get('/feriados', (req, res) => {
  try {
    const filters = {
      meses: req.query.meses ? req.query.meses.split(',') : null,
      tipos: req.query.tipos ? req.query.tipos.split(',') : null,
      estados: req.query.estados ? req.query.estados.split(',') : null,
      nome: req.query.nome || null,
      data: req.query.data || null
    };

    const filteredHolidays = filterHolidays(allHolidays, filters);

    res.json({
      total: filteredHolidays.length,
      filtros_aplicados: filters,
      feriados: filteredHolidays
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

// Listar apenas feriados nacionais
app.get('/feriados/nacionais', (req, res) => {
  try {
    const filters = {
      tipos: ['NACIONAL'],
      meses: req.query.meses ? req.query.meses.split(',') : null,
      nome: req.query.nome || null,
      data: req.query.data || null
    };

    const filteredHolidays = filterHolidays(allHolidays, filters);

    res.json({
      total: filteredHolidays.length,
      feriados: filteredHolidays
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

// Listar feriados estaduais
app.get('/feriados/estaduais', (req, res) => {
  try {
    const filters = {
      tipos: ['ESTADUAL'],
      meses: req.query.meses ? req.query.meses.split(',') : null,
      estados: req.query.estados ? req.query.estados.split(',') : null,
      nome: req.query.nome || null,
      data: req.query.data || null
    };

    const filteredHolidays = filterHolidays(allHolidays, filters);

    res.json({
      total: filteredHolidays.length,
      feriados: filteredHolidays
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

// Listar feriados municipais
app.get('/feriados/municipais', (req, res) => {
  try {
    const filters = {
      tipos: ['MUNICIPAL'],
      meses: req.query.meses ? req.query.meses.split(',') : null,
      estados: req.query.estados ? req.query.estados.split(',') : null,
      nome: req.query.nome || null,
      data: req.query.data || null
    };

    const filteredHolidays = filterHolidays(allHolidays, filters);

    res.json({
      total: filteredHolidays.length,
      feriados: filteredHolidays
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

// Buscar feriados por data específica
app.get('/feriados/data/:dia/:mes', (req, res) => {
  try {
    const dia = req.params.dia.padStart(2, '0');
    const mes = req.params.mes.padStart(2, '0');
    const data = `${dia}/${mes}`;
    
    // Validar formato da data
    const diaNum = parseInt(dia);
    const mesNum = parseInt(mes);
    
    if (diaNum < 1 || diaNum > 31 || mesNum < 1 || mesNum > 12) {
      return res.status(400).json({ 
        error: 'Data inválida. Dia deve estar entre 01-31 e mês entre 01-12' 
      });
    }

    const filters = { data };
    const filteredHolidays = filterHolidays(allHolidays, filters);

    res.json({
      data_consultada: data,
      total: filteredHolidays.length,
      feriados: filteredHolidays
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

// Listar estados brasileiros
app.get('/estados', (req, res) => {
  res.json({
    total: ESTADOS.length,
    estados: ESTADOS
  });
});

// Estatísticas dos feriados
app.get('/stats', (req, res) => {
  try {
    const stats = {
      total_feriados: allHolidays.length,
      por_tipo: {
        nacionais: nationalHolidays.length,
        estaduais: stateHolidays.length,
        municipais: municipalHolidays.length
      },
      por_mes: {}
    };

    // Contar feriados por mês
    allHolidays.forEach(feriado => {
      const [dia, mes] = feriado.data.split("/");
      const mesNome = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ][parseInt(mes) - 1];
      
      if (!stats.por_mes[mesNome]) {
        stats.por_mes[mesNome] = 0;
      }
      stats.por_mes[mesNome]++;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    message: 'Acesse GET / para ver a documentação da API'
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Feriados Brasil 2025 rodando na porta ${PORT}`);
  console.log(`📖 Documentação disponível em: http://localhost:${PORT}/`);
});

module.exports = app;

