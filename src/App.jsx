import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Calendar, Filter, MapPin, Search, Loader2 } from "lucide-react";
import "./App.css";
import { MultiSelect } from "./components/multi-select.jsx";
import Select from "react-select";

// Importar dados dos feriados
import nationalHolidays from "./assets/national_holidays_2025.json";
import stateHolidays from "./assets/state_holidays_2025.json";
import municipalHolidays from "./assets/municipal_holidays_2025.json";

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

// Meses do ano
const MESES = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

// Tipos de feriado
const TIPOS_FERIADO = [
  { value: "NACIONAL", label: "Nacional" },
  { value: "ESTADUAL", label: "Estadual" },
  { value: "MUNICIPAL", label: "Municipal" },
];

function App() {
  // Carregar filtros do localStorage, se existirem
  const [filtroMeses, setFiltroMeses] = useState(() => {
    const saved = localStorage.getItem("filtroMeses");
    return saved ? JSON.parse(saved) : [];
  });
  const [filtroTipos, setFiltroTipos] = useState(() => {
    const saved = localStorage.getItem("filtroTipos");
    return saved ? JSON.parse(saved) : [];
  });
  const [filtroEstados, setFiltroEstados] = useState(() => {
    const saved = localStorage.getItem("filtroEstados");
    return saved ? JSON.parse(saved) : [];
  });
  const [filtroMunicipios, setFiltroMunicipios] = useState(() => {
    const saved = localStorage.getItem("filtroMunicipios");
    return saved ? JSON.parse(saved) : [];
  });
  // Salvar filtros no localStorage sempre que mudarem
  useEffect(() => {
    localStorage.setItem("filtroMeses", JSON.stringify(filtroMeses));
  }, [filtroMeses]);

  useEffect(() => {
    localStorage.setItem("filtroTipos", JSON.stringify(filtroTipos));
  }, [filtroTipos]);

  useEffect(() => {
    localStorage.setItem("filtroEstados", JSON.stringify(filtroEstados));
  }, [filtroEstados]);

  useEffect(() => {
    localStorage.setItem("filtroMunicipios", JSON.stringify(filtroMunicipios));
  }, [filtroMunicipios]);

  const [feriadosExibidos, setFeriadosExibidos] = useState([]);
  const [buscaRealizada, setBuscaRealizada] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estado de loading para municípios
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);
  const [municipiosDisponiveis, setMunicipiosDisponiveis] = useState([]);

  useEffect(() => {
    if (filtroEstados.length === 0) {
      setMunicipiosDisponiveis([]);
      return;
    }
    setLoadingMunicipios(true);
    Promise.resolve().then(() => {
      setTimeout(() => {
        const municipiosSet = new Set();
        municipalHolidays.forEach((feriado) => {
          if (filtroEstados.includes(feriado.uf) && feriado.municipio) {
            const key = `${feriado.uf} - ${feriado.municipio}`;
            municipiosSet.add(key);
          }
        });
        const lista = Array.from(municipiosSet)
          .sort()
          .map((key) => ({ value: key, label: key }));
        setMunicipiosDisponiveis(lista);
        setLoadingMunicipios(false);
      }, 300);
    });
  }, [filtroEstados]);

  // Combinar todos os feriados
  const todosOsFeriados = useMemo(() => {
    return [...nationalHolidays, ...stateHolidays, ...municipalHolidays];
  }, []);

  // Função para buscar feriados baseado nos filtros selecionados
  const buscarFeriados = () => {
    setIsLoading(true);
    setBuscaRealizada(false);

    // Simular carregamento para dar feedback visual ao usuário
    setTimeout(() => {
      let feriados = [...todosOsFeriados];

      // Filtro por mês
      if (filtroMeses.length > 0) {
        feriados = feriados.filter((feriado) => {
          const [dia, mes] = feriado.data.split("/");
          return filtroMeses.includes(mes);
        });
      }

      // Filtro por tipo
      if (filtroTipos.length > 0) {
        feriados = feriados.filter((feriado) =>
          filtroTipos.includes(feriado.tipo)
        );
      }

      // Filtro por estado
      if (filtroEstados.length > 0) {
        feriados = feriados.filter((feriado) => {
          if (feriado.tipo === "NACIONAL") return true;
          return filtroEstados.includes(feriado.uf);
        });
      }

      // Filtro por município
      if (filtroMunicipios.length > 0) {
        feriados = feriados.filter((feriado) => {
          if (feriado.tipo !== "MUNICIPAL") return true;
          const municipioKey = `${feriado.uf} - ${feriado.municipio}`;
          return filtroMunicipios.includes(municipioKey);
        });
      }

      // Ordenar por data
      const feriadosOrdenados = feriados.sort((a, b) => {
        const [diaA, mesA] = a.data.split("/");
        const [diaB, mesB] = b.data.split("/");
        const dataA = new Date(2025, parseInt(mesA) - 1, parseInt(diaA));
        const dataB = new Date(2025, parseInt(mesB) - 1, parseInt(diaB));
        return dataA - dataB;
      });

      setFeriadosExibidos(feriadosOrdenados);
      setBuscaRealizada(true);
      setIsLoading(false);
    }, 800); // 800ms de delay para mostrar o loading
  };

  // Função para limpar filtros
  const limparFiltros = () => {
    setFiltroMeses([]);
    setFiltroTipos([]);
    setFiltroEstados([]);
    setFiltroMunicipios([]);
    setFeriadosExibidos([]);
    setBuscaRealizada(false);
    // Limpar localStorage dos filtros
    localStorage.removeItem("filtroMeses");
    localStorage.removeItem("filtroTipos");
    localStorage.removeItem("filtroEstados");
    localStorage.removeItem("filtroMunicipios");
  };

  // Função para formatar data
  const formatarData = (data) => {
    const [dia, mes] = data.split("/");
    const meses = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    return `${dia} de ${meses[parseInt(mes) - 1]}`;
  };

  // Função para formatar data com dia da semana
  const formatarDataComDiaSemana = (data) => {
    const [dia, mes] = data.split("/");
    const dataObj = new Date(2025, parseInt(mes) - 1, parseInt(dia));
    const diasSemana = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];
    const diaSemana = diasSemana[dataObj.getDay()];
    return `${formatarData(data)} (${diaSemana})`;
  };

  // Função para obter cor do badge baseado no tipo
  const getCorTipo = (tipo) => {
    switch (tipo) {
      case "NACIONAL":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "ESTADUAL":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "MUNICIPAL":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <>
      {/* Dados estruturados para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Feriados Brasil 2025",
            url: "https://feriados-brasil-2025.vercel.app/",
            description:
              "Confira todos os feriados nacionais, estaduais e municipais do Brasil em 2025. Calendário completo, atualizado e fácil de consultar.",
          }),
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              Feriados Brasil 2025
            </h1>
            <p className="text-gray-600 text-lg">
              Consulte todos os feriados nacionais, estaduais e municipais do
              Brasil
            </p>
          </div>

          {/* Filtros */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
              <CardDescription>
                Selecione os filtros desejados e clique em "Buscar Feriados"
                para visualizar os resultados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Filtro por Mês */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Mês</label>
                  <Select
                    isMulti
                    options={MESES}
                    value={MESES.filter((opt) =>
                      filtroMeses.includes(opt.value)
                    )}
                    onChange={(selected) =>
                      setFiltroMeses(
                        selected ? selected.map((opt) => opt.value) : []
                      )
                    }
                    placeholder={
                      MESES.length > 0
                        ? "Selecione os meses"
                        : "Nenhum mês disponível"
                    }
                    isClearable
                    isSearchable
                    closeMenuOnSelect={false}
                    noOptionsMessage={() => "Nenhum mês encontrado"}
                  />
                </div>

                {/* Filtro por Tipo */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Tipo de Feriado
                  </label>
                  <Select
                    isMulti
                    options={TIPOS_FERIADO}
                    value={TIPOS_FERIADO.filter((opt) =>
                      filtroTipos.includes(opt.value)
                    )}
                    onChange={(selected) =>
                      setFiltroTipos(
                        selected ? selected.map((opt) => opt.value) : []
                      )
                    }
                    placeholder={
                      TIPOS_FERIADO.length > 0
                        ? "Selecione os tipos"
                        : "Nenhum tipo disponível"
                    }
                    isClearable
                    isSearchable
                    closeMenuOnSelect={false}
                    noOptionsMessage={() => "Nenhum tipo encontrado"}
                  />
                </div>

                {/* Filtro por Estado */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Estado (UF)
                  </label>
                  <Select
                    isMulti
                    options={ESTADOS}
                    value={ESTADOS.filter((opt) =>
                      filtroEstados.includes(opt.value)
                    )}
                    onChange={(selected) =>
                      setFiltroEstados(
                        selected ? selected.map((opt) => opt.value) : []
                      )
                    }
                    placeholder={
                      ESTADOS.length > 0
                        ? "Selecione os estados"
                        : "Nenhum estado disponível"
                    }
                    isClearable
                    isSearchable
                    closeMenuOnSelect={false}
                    noOptionsMessage={() => "Nenhum estado encontrado"}
                  />
                </div>

                {/* Filtro por Município - só aparece se houver estado selecionado */}
                {filtroEstados.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Município
                    </label>
                    {loadingMunicipios ? (
                      <div className="flex items-center gap-2 text-gray-500 text-sm py-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Carregando
                        municípios...
                      </div>
                    ) : (
                      <Select
                        isMulti
                        options={municipiosDisponiveis}
                        value={municipiosDisponiveis.filter((opt) =>
                          filtroMunicipios.includes(opt.value)
                        )}
                        onChange={(selected) =>
                          setFiltroMunicipios(
                            selected ? selected.map((opt) => opt.value) : []
                          )
                        }
                        placeholder={
                          municipiosDisponiveis.length > 0
                            ? "Selecione os municípios"
                            : "Nenhum município disponível"
                        }
                        isClearable
                        isSearchable
                        styles={{
                          menu: (base) => ({ ...base, maxHeight: 300 }),
                        }}
                        closeMenuOnSelect={false}
                        noOptionsMessage={() => "Nenhum município encontrado"}
                      />
                    )}
                  </div>
                )}

                {/* Botões de Ação */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={buscarFeriados}
                    disabled={isLoading}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    {isLoading ? "Buscando..." : "Buscar Feriados"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={limparFiltros}
                    disabled={isLoading}
                    className="cursor-pointer"
                  >
                    Limpar Busca
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading */}
          {isLoading && (
            <Card className="text-center py-12">
              <CardContent>
                <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Carregando feriados...
                </h3>
                <p className="text-gray-500">
                  Aguarde enquanto buscamos os feriados com base nos filtros
                  selecionados
                </p>
              </CardContent>
            </Card>
          )}

          {/* Resultados */}
          {buscaRealizada && !isLoading && (
            <div className="mb-4">
              <p className="text-gray-600">
                Encontrados{" "}
                <span className="font-semibold">{feriadosExibidos.length}</span>{" "}
                feriados
              </p>
            </div>
          )}

          {/* Lista de Feriados */}
          {buscaRealizada && !isLoading && feriadosExibidos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {feriadosExibidos.map((feriado, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {feriado.nome}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          {formatarDataComDiaSemana(feriado.data)}
                        </CardDescription>
                      </div>
                      <Badge className={getCorTipo(feriado.tipo)}>
                        {feriado.tipo}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {feriado.uf && (
                      <div className="flex items-center gap-1 mb-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {feriado.uf}
                          {feriado.municipio && ` - ${feriado.municipio}`}
                        </span>
                      </div>
                    )}
                    {feriado.descricao && (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {feriado.descricao}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {buscaRealizada && !isLoading && feriadosExibidos.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum feriado encontrado
                </h3>
                <p className="text-gray-500">
                  Tente ajustar os filtros para encontrar feriados
                </p>
              </CardContent>
            </Card>
          )}

          {!buscaRealizada && !isLoading && (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecione os filtros e clique em "Buscar Feriados"
                </h3>
                <p className="text-gray-500">
                  Use os filtros acima para encontrar os feriados desejados
                </p>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center mt-12 py-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              © 2025 Feriados Brasil — Desenvolvido por&nbsp;
              <a
                href="https://github.com/marcosmallet/feriados-brasil-2025"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                marcosmallet
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
