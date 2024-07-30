import { useState, useEffect } from "react";
import OknLineChart from "./OknLineChart";
import OknDemographicChart from "./OknDemographicChart";
import type {
  LineChartDataType,
  LineChartRawDataObject,
  DemographicChartDataType,
  DemographicChartRawDataObject,
} from "../../data/types";
import { useStore } from "@nanostores/react";
import { filtersStore, dateRangeStore } from "../../stores/filterStore";
import { filterList } from "../../../types/filters";

type ChartsProp = {
  censusBlock: number[] | undefined;
  trigger: boolean;
};

type SelectedFiltersType = {
  [key: string]: any;
};

const convertYesNoToNumber = (filters: SelectedFiltersType) => {
  const updatedFilters = { ...filters };
  Object.keys(updatedFilters).forEach((key) => {
    const filter = filterList.find((f) => f.key === key);
    if (filter && filter.options && filter.options.includes("Yes")) {
      updatedFilters[key] = updatedFilters[key].map((value: string) =>
        value === "Yes" ? 1.0 : value === "No" ? 0.0 : value
      );
    }
  });
  return updatedFilters;
};

const Charts = ({ censusBlock, trigger }: ChartsProp) => {
  const filters = useStore(filtersStore);
  const dateRange = useStore(dateRangeStore);

  const [lineChartData, setLineChartData] = useState<LineChartDataType[]>([]);
  const [demographicChartData, setDemographicChartData] = useState<
    DemographicChartDataType[]
  >([]);

  useEffect(() => {
    fetchData();
  }, [censusBlock, trigger]);

  const fetchData = async () => {
    const selectedFilters: SelectedFiltersType = filters.selectedKeys.reduce(
      (acc: SelectedFiltersType, key: string) => {
        if (filters[key]) {
          acc[key] = filters[key];
        }
        return acc;
      },
      {}
    );

    const convertedFilters = convertYesNoToNumber(selectedFilters);

    // try to fetch data from the server
    try {
      // Fetch line chart data
      const response = await fetch("http://127.0.0.1:12345/line-chart-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: dateRange?.start.toString() ?? "2023-01-01",
          end_date: dateRange?.end.toString() ?? "2023-12-31",
          census_block: censusBlock,
          filters: convertedFilters,
        }),
      });
      const data: LineChartRawDataObject = await response.json();
      // Convert the object into an array of objects for the chart
      const chartData = Object.keys(data).map((dateKey) => {
        return { date: dateKey, counts: data[dateKey] } as LineChartDataType;
      });
      setLineChartData(chartData);

      // Fetch demographic chart data
      const demographicResponse = await fetch(
        "http://127.0.0.1:12345/demographic-chart-data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            start_date: dateRange?.start.toString() ?? "2023-01-01",
            end_date: dateRange?.end.toString() ?? "2023-12-31",
            census_block: censusBlock,
            filters: convertedFilters,
            demographic_features: "sex",
          }),
        }
      );
      const demographicData: DemographicChartRawDataObject =
        await demographicResponse.json();

      const demographicChartData = Object.keys(demographicData).map((key) => {
        return { feature: key, counts: demographicData[key] };
      });

      setDemographicChartData(demographicChartData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return (
    <div className="w-screen flex flex-col items-center justify-center mt-4">
      <div className="w-full flex flex-row items-center justify-center">
        {lineChartData.length === 0 && demographicChartData.length === 0 && (
          <div className="text-lg text-gray-500 mt-4">
            No data available for this census block.
          </div>
        )}
        <OknLineChart data={lineChartData} />
        <OknDemographicChart data={demographicChartData} />
      </div>
    </div>
  );
};

export default Charts;
