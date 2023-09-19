import React from "react";
import CancleIcon from "icons/CancleIcon";
import styles from "./chip.module.scss";
import useDeepCompareEffect from "hooks/use-deep-effect";

interface ChipInputProps extends React.ComponentPropsWithRef<"input"> {
  value?: string[];
  label?: string;
  onChange: (e: any) => void;
}

const ChipInput = React.forwardRef(
  (
    { onChange, value, label, ...rest }: ChipInputProps,
    ref: React.Ref<HTMLInputElement>
  ) => {
    const [chips, setChips] = React.useState<string[]>([]);

    const onAddIndusrtryChip = React.useCallback(
      (chip: any) => {
        const newChips = [...chips];
        if (chip.code === "Enter") {
          if (chip.target.value) {
            chip.target.value = chip.target.value;
            newChips.push(chip.target.value);
            setChips(newChips);
          }
          chip.target.value = "";
        }
      },
      [chips]
    );

    const handleRemoveIndustryChip = (index: any) => {
      const newChips = [...chips];
      newChips.splice(index, 1);
      setChips(newChips);
    };

    React.useMemo(() => {
      if (value) {
        setChips(value);
      }
    }, [value]);

    useDeepCompareEffect(() => {
      onChange(chips);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chips]);

    return (
      <>
        <label className={styles.label}>{label}</label>
        <div className={styles.chips}>
          <div className={styles.chipList}>
            <ul>
              {chips.map((item: any, index: any) => (
                <li className={styles.chip} key={index}>
                  {item}
                  <i onClick={() => handleRemoveIndustryChip(index)}>
                    <CancleIcon height={16} width={16} fill="#fff" />
                  </i>
                </li>
              ))}
              <div className={styles.field}>
                <input
                  ref={ref}
                  type="text"
                  name="name"
                  className="chipinput"
                  //   placeholder={true ? "Type here..." : ""}
                  onKeyUp={(e) => onAddIndusrtryChip(e)}
                  {...rest}
                />
              </div>
            </ul>
          </div>
        </div>
      </>
    );
  }
);

ChipInput.displayName = "ChipInput";
export default ChipInput;
