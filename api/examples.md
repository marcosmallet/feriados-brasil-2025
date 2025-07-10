# Exemplos Práticos de Uso da API

Este arquivo contém exemplos práticos de como usar a API de Feriados Brasil 2025 em diferentes linguagens e cenários.

## Exemplos em JavaScript

### 1. Buscar Todos os Feriados Nacionais
```javascript
async function buscarFeriadosNacionais() {
  try {
    const response = await fetch('http://localhost:3000/feriados/nacionais');
    const data = await response.json();
    
    console.log(`Total de feriados nacionais: ${data.total}`);
    data.feriados.forEach(feriado => {
      console.log(`${feriado.data} - ${feriado.nome}`);
    });
  } catch (error) {
    console.error('Erro ao buscar feriados:', error);
  }
}
```

### 2. Verificar se uma Data é Feriado
```javascript
async function verificarFeriado(data) {
  try {
    const response = await fetch(`http://localhost:3000/feriados/buscar?data=${data}`);
    const result = await response.json();
    
    if (result.total > 0) {
      console.log(`${data} é feriado: ${result.feriados[0].nome}`);
      return true;
    } else {
      console.log(`${data} não é feriado`);
      return false;
    }
  } catch (error) {
    console.error('Erro ao verificar feriado:', error);
    return false;
  }
}

// Uso
verificarFeriado('25/12');
verificarFeriado('15/03');
```

### 3. Buscar Feriados de um Estado Específico
```javascript
async function feriadosDoEstado(uf) {
  try {
    const response = await fetch(`http://localhost:3000/feriados?estados=${uf}`);
    const data = await response.json();
    
    console.log(`Feriados de ${uf}:`);
    data.feriados.forEach(feriado => {
      console.log(`${feriado.data} - ${feriado.nome} (${feriado.tipo})`);
    });
  } catch (error) {
    console.error('Erro ao buscar feriados do estado:', error);
  }
}

// Buscar feriados de São Paulo
feriadosDoEstado('SP');
```

## Exemplos em Python

### 1. Cliente Python Simples
```python
import requests
import json

class FeriadosAPI:
    def __init__(self, base_url='http://localhost:3000'):
        self.base_url = base_url
    
    def buscar_feriados_nacionais(self):
        """Busca todos os feriados nacionais"""
        response = requests.get(f'{self.base_url}/feriados/nacionais')
        return response.json()
    
    def verificar_feriado(self, data):
        """Verifica se uma data específica é feriado"""
        response = requests.get(f'{self.base_url}/feriados/buscar', 
                              params={'data': data})
        result = response.json()
        return len(result['feriados']) > 0, result['feriados']
    
    def feriados_do_mes(self, mes):
        """Busca feriados de um mês específico"""
        response = requests.get(f'{self.base_url}/feriados', 
                              params={'meses': mes})
        return response.json()
    
    def feriados_do_estado(self, uf):
        """Busca feriados de um estado específico"""
        response = requests.get(f'{self.base_url}/feriados', 
                              params={'estados': uf})
        return response.json()

# Exemplo de uso
api = FeriadosAPI()

# Buscar feriados nacionais
nacionais = api.buscar_feriados_nacionais()
print(f"Total de feriados nacionais: {nacionais['total']}")

# Verificar se 25/12 é feriado
eh_feriado, feriados = api.verificar_feriado('25/12')
if eh_feriado:
    print(f"25/12 é feriado: {feriados[0]['nome']}")

# Feriados de dezembro
dezembro = api.feriados_do_mes('12')
print(f"Feriados de dezembro: {dezembro['total']}")
```

### 2. Integração com Pandas
```python
import pandas as pd
import requests

def feriados_para_dataframe():
    """Converte feriados em DataFrame do pandas"""
    response = requests.get('http://localhost:3000/feriados')
    data = response.json()
    
    df = pd.DataFrame(data['feriados'])
    
    # Converter data para datetime
    df['data_datetime'] = pd.to_datetime(df['data'], format='%d/%m/%Y')
    
    # Adicionar colunas úteis
    df['mes'] = df['data_datetime'].dt.month
    df['dia_semana'] = df['data_datetime'].dt.day_name()
    
    return df

# Criar DataFrame
df_feriados = feriados_para_dataframe()

# Análises
print("Feriados por tipo:")
print(df_feriados['tipo'].value_counts())

print("\nFeriados por mês:")
print(df_feriados['mes'].value_counts().sort_index())

print("\nFeriados que caem no fim de semana:")
fim_semana = df_feriados[df_feriados['dia_semana'].isin(['Saturday', 'Sunday'])]
print(fim_semana[['nome', 'data', 'dia_semana']])
```

## Exemplos em PHP

### 1. Cliente PHP Básico
```php
<?php
class FeriadosAPI {
    private $baseUrl;
    
    public function __construct($baseUrl = 'http://localhost:3000') {
        $this->baseUrl = $baseUrl;
    }
    
    public function buscarFeriados($filtros = []) {
        $url = $this->baseUrl . '/feriados';
        if (!empty($filtros)) {
            $url .= '?' . http_build_query($filtros);
        }
        
        $response = file_get_contents($url);
        return json_decode($response, true);
    }
    
    public function verificarFeriado($data) {
        $url = $this->baseUrl . '/feriados/buscar?data=' . urlencode($data);
        $response = file_get_contents($url);
        $result = json_decode($response, true);
        
        return $result['total'] > 0;
    }
    
    public function feriadosNacionais() {
        $url = $this->baseUrl . '/feriados/nacionais';
        $response = file_get_contents($url);
        return json_decode($response, true);
    }
}

// Exemplo de uso
$api = new FeriadosAPI();

// Verificar se hoje é feriado
$hoje = date('d/m');
if ($api->verificarFeriado($hoje)) {
    echo "Hoje é feriado!";
} else {
    echo "Hoje não é feriado.";
}

// Buscar feriados de São Paulo
$feriadosSP = $api->buscarFeriados(['estados' => 'SP']);
echo "Feriados de SP: " . $feriadosSP['total'];
?>
```

## Exemplos em cURL

### 1. Scripts de Shell
```bash
#!/bin/bash

# Função para verificar se uma data é feriado
verificar_feriado() {
    local data=$1
    local response=$(curl -s "http://localhost:3000/feriados/buscar?data=$data")
    local total=$(echo $response | grep -o '"total":[0-9]*' | cut -d':' -f2)
    
    if [ "$total" -gt 0 ]; then
        echo "$data é feriado"
        return 0
    else
        echo "$data não é feriado"
        return 1
    fi
}

# Função para listar feriados de um mês
feriados_do_mes() {
    local mes=$1
    echo "Feriados do mês $mes:"
    curl -s "http://localhost:3000/feriados?meses=$mes" | \
    grep -o '"nome":"[^"]*"' | \
    sed 's/"nome":"//g' | \
    sed 's/"//g'
}

# Exemplos de uso
verificar_feriado "25/12"
verificar_feriado "15/03"
feriados_do_mes "12"
```

## Casos de Uso Avançados

### 1. Sistema de Notificações
```javascript
// Notificar sobre próximos feriados
async function notificarProximosFeriados() {
  const hoje = new Date();
  const proximoMes = hoje.getMonth() + 2; // Mês seguinte (0-indexed + 1 + 1)
  
  const response = await fetch(`http://localhost:3000/feriados?meses=${proximoMes.toString().padStart(2, '0')}`);
  const data = await response.json();
  
  if (data.total > 0) {
    console.log(`Próximos feriados em ${proximoMes}:`);
    data.feriados.forEach(feriado => {
      console.log(`📅 ${feriado.data} - ${feriado.nome}`);
    });
  }
}
```

### 2. Validação de Agendamentos
```python
def validar_agendamento(data_agendamento, uf=None):
    """Valida se uma data é válida para agendamento (não é feriado)"""
    api = FeriadosAPI()
    
    # Verificar feriados nacionais
    eh_feriado, feriados = api.verificar_feriado(data_agendamento)
    
    if eh_feriado:
        feriado_nacional = any(f['tipo'] == 'NACIONAL' for f in feriados)
        if feriado_nacional:
            return False, f"Data é feriado nacional: {feriados[0]['nome']}"
    
    # Se especificou UF, verificar feriados estaduais
    if uf:
        estaduais = api.feriados_do_estado(uf)
        for feriado in estaduais['feriados']:
            if feriado['data'].startswith(data_agendamento):
                return False, f"Data é feriado em {uf}: {feriado['nome']}"
    
    return True, "Data válida para agendamento"

# Exemplo
valido, mensagem = validar_agendamento('25/12', 'SP')
print(mensagem)
```

### 3. Relatório de Feriados
```python
def gerar_relatorio_feriados():
    """Gera relatório completo de feriados"""
    api = FeriadosAPI()
    
    # Buscar estatísticas
    stats_response = requests.get('http://localhost:3000/stats')
    stats = stats_response.json()
    
    print("=== RELATÓRIO DE FERIADOS BRASIL 2025 ===")
    print(f"Total de feriados: {stats['total_feriados']}")
    print(f"Nacionais: {stats['por_tipo']['nacionais']}")
    print(f"Estaduais: {stats['por_tipo']['estaduais']}")
    print(f"Municipais: {stats['por_tipo']['municipais']}")
    
    print("\nDistribuição por mês:")
    for mes, quantidade in stats['por_mes'].items():
        print(f"{mes}: {quantidade} feriados")
    
    # Buscar feriados nacionais
    nacionais = api.buscar_feriados_nacionais()
    print("\n=== FERIADOS NACIONAIS ===")
    for feriado in nacionais['feriados']:
        print(f"{feriado['data']} - {feriado['nome']}")

gerar_relatorio_feriados()
```

## Integração com Frameworks Web

### React Hook
```javascript
import { useState, useEffect } from 'react';

function useFeriados(filtros = {}) {
  const [feriados, setFeriados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchFeriados() {
      try {
        setLoading(true);
        const params = new URLSearchParams(filtros);
        const response = await fetch(`http://localhost:3000/feriados?${params}`);
        const data = await response.json();
        setFeriados(data.feriados);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFeriados();
  }, [JSON.stringify(filtros)]);
  
  return { feriados, loading, error };
}

// Uso no componente
function FeriadosComponent() {
  const { feriados, loading, error } = useFeriados({ tipos: 'NACIONAL' });
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return (
    <ul>
      {feriados.map(feriado => (
        <li key={feriado.data}>
          {feriado.data} - {feriado.nome}
        </li>
      ))}
    </ul>
  );
}
```

Estes exemplos demonstram a versatilidade da API e como ela pode ser integrada em diferentes tipos de aplicações e linguagens de programação.

