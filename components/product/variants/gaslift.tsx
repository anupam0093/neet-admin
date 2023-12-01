import useDeepCompareEffect from "hooks/use-deep-effect";
import { useFetchIconsByType } from "network-requests/queries";
import React, { useEffect } from "react";
import { VarientsProps } from "typings/variants";
import DynamicInputFields from "../../element/input-field";

const GasLift = ({ getValue, value, id }: VarientsProps) => {
    const { data = [] } = useFetchIconsByType("GasLift", id as string);
    console.log({ value, useFetchIconsByTypeGasLift: data });

    const [state, setState] = React.useState<any>([]);
    // data[0].label
    // data[0].value
    useEffect(() => {
        getValue(state);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);
    return (
        <DynamicInputFields
            title={"GasLift"}
            label="Gas Lift"
            initialValue={value}
            options={[
                { label: "Select a Gas Lift", value: "" },
                ...(data as any),
            ]}
            getValue={(value) => getValue(value)}
        />
    );
};

export default GasLift;
