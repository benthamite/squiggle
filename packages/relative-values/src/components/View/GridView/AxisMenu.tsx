import { FormHeader } from "@/components/ui/FormHeader";
import { ArrowDownIcon } from "@/components/ui/icons/ArrowDownIcon";
import { ArrowLeftIcon } from "@/components/ui/icons/ArrowLeftIcon";
import { ArrowRightIcon } from "@/components/ui/icons/ArrowRightIcon";
import { ArrowUpIcon } from "@/components/ui/icons/ArrowUpIcon";
import clsx from "clsx";
import { FC } from "react";
import { ClusterFilter } from "../ClusterFilter";
import {
  Axis,
  SortConfig,
  SortMode,
  useViewContext,
  useViewDispatch,
} from "../ViewProvider";

const SortBy: FC<{
  axis: Axis;
  mode: SortMode; // mode of this control
  config: SortConfig; // current sort config for this axis
  text: string;
}> = ({ axis, mode, config, text }) => {
  const dispatch = useViewDispatch();

  const isCurrentMode = mode === config.mode;
  const targetDesc = isCurrentMode ? !config.desc : false;
  const iconDesc = isCurrentMode ? config.desc : false;

  const Icon =
    axis === "rows"
      ? iconDesc
        ? ArrowUpIcon
        : ArrowDownIcon
      : iconDesc
      ? ArrowLeftIcon
      : ArrowRightIcon;

  const setSort = () => {
    dispatch({
      type: "setSort",
      payload: {
        axis,
        sort: {
          mode,
          desc: targetDesc,
        },
      },
    });
  };

  return (
    <div className="flex items-center cursor-pointer group" onClick={setSort}>
      <Icon
        className={
          isCurrentMode
            ? "stroke-gray-600"
            : "stroke-white group-hover:stroke-gray-300"
        }
      />
      <div
        className={clsx(
          "ml-2 text-sm font-medium",
          isCurrentMode ? "text-black" : "text-gray-400 group-hover:text-black"
        )}
      >
        {text}
      </div>
    </div>
  );
};

export const AxisMenu: FC<{ axis: Axis; sortByAverage?: boolean }> = ({
  axis,
  sortByAverage = true,
}) => {
  const {
    axisConfig: {
      [axis]: { sort },
    },
  } = useViewContext();
  return (
    <div className="px-6 py-6 min-w-[16em] flex flex-col gap-6">
      <div>
        <FormHeader>Clusters</FormHeader>
        <ClusterFilter axis={axis} />
      </div>
      <div>
        <FormHeader>Sort by</FormHeader>
        <div className="flex flex-col gap-2">
          <SortBy axis={axis} config={sort} mode="default" text="Default" />
          <SortBy
            axis={axis}
            config={sort}
            mode="median"
            text={sortByAverage ? "Average value" : "Value"}
          />
          <SortBy
            axis={axis}
            config={sort}
            mode="uncertainty"
            text={sortByAverage ? "Average uncertainty" : "Uncertainty"}
          />
        </div>
      </div>
    </div>
  );
};
