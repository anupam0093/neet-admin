import React, { ChangeEvent, useEffect, useState } from "react";
import styles from "styles/admin.module.scss";
import AddMoreButton from "./addmore";
import Input from "./input";
import Select from "./select";

interface InputFields {
  name: string;
  // price: string;
  basePrice:string;
  price:string;
}

interface DynamicInputProps {
  title: string;
  options: any[];
  label?: string;
  getValue: (value: InputFields[]) => void;
  initialValue?: InputFields[];
}

function DynamicInputFields({
  title,
  options,
  getValue,
  initialValue,
  label,
}: DynamicInputProps) {
  const [inputFields, setInputFields] = useState<InputFields[]>([]);

  const handleFormChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    console.log({ event });
    let data = [...inputFields] as any;
    data[index][event.target.name] = event.target.value;
    setInputFields(data);
    getValue(data);
  };
console.log("line41",inputFields)

  //   for open pop in refund

  const [isOpen, setisOpen] = React.useState(false);

  const handleOpenChnage = () => [setisOpen(true)];

  const handleCloseChange = () => {
    setisOpen(false);
  };

  const addFields = () => {
    let object = { name: "", price:"", basePrice:"" };
    setInputFields([...inputFields, object]);
    getValue([...inputFields, object]);
  };

  const removeFields = (index: number) => {
    let data = [...inputFields];
    data.splice(index, 1);
    setInputFields(data);
    getValue(data);
  };

  useEffect(() => {
    if (initialValue && initialValue?.length > 0) {
      setInputFields(initialValue);
    }
  }, [initialValue]);

  options?.map((item) => {
    if (item?._id) {
      item.value = item._id;
    }
  });

  console.log({ initialValue, inputFields, options });

  return (
    <React.Fragment>
      {/* Dynamic Fields */}
      {title && <h1 className={styles.heading}>{title}</h1>}
      <div className={styles.grid}>
        {inputFields.map((data: any, index: number) => {
          console.log({ check: data });
          return (
            <React.Fragment key={index}>
              <Select
                name="name"
                label={`${label} Name`}
                options={options}
                onChange={(e) => handleFormChange(index, e)}
                value={data?.name}
              />

              <div className="d-flex" style={{ alignItems: "center" }}>
              <Input
                  name="basePrice"
                  type="number"
                  min={0}
                  label={`${label} Base Price`}
                  placeholder="Enter base price"
                  value={data?.basePrice}
                  onChange={(e) => handleFormChange(index, e)}          
                  style={{ width: "50%" }}
                />
                <Input
                  name="price"
                  type="number"
                  min={0}
                  label={`${label} Selling Price`}
                  placeholder="Enter selling price"
                  value={data?.price}
                  onChange={(e) => handleFormChange(index, e)}
                  deletable
                  onDelete={() => removeFields(index)}
                  style={{ width: "50%" }}
                />
              </div>
            </React.Fragment>
          );
        })}
        <AddMoreButton onClick={addFields} title={`Add More ${label}`} />
      </div>
    </React.Fragment>
  );
}

export default DynamicInputFields;
