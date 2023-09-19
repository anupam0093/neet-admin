import React from "react";
import css from "./model.module.scss";

type Ref<T> = React.RefObject<T> | null;
type Props = {
  show: boolean;
  //   containerProps?: React.ComponentPropsWithRef<"div">;
} & React.ComponentPropsWithRef<"div">;

const Component = (
  { children, show, ...props }: Props,
  ref: Ref<HTMLDivElement>
) => (
  <React.Fragment>
    {show && (
      <div className={`${css["container"]}`}>
        <div
          {...props}
          ref={ref}
          className={`${css["inner"]} ${props.className}`}
        >
          {children}
        </div>
      </div>
    )}
  </React.Fragment>
);

// @ts-expect-error
const ModelView = React.forwardRef(Component);
ModelView.displayName = "ModelView";
ModelView.defaultProps = {};

export default ModelView;
