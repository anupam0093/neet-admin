/* eslint-disable @next/next/no-img-element */
import useDeepEffect from "hooks/use-deep-effect";
import React from "react";
import { useEffect } from "react";
import styles from "styles/admin.module.scss";
import AddMoreButton from "./addmore";
import Input from "./input";
import Select from "./select";

interface DynamicInputProps {
  title?: string;
  getValue: (value: any) => void;
  initialValue?: any;
}

function DynamicImageForm({
  title,
  getValue,
  initialValue,
}: DynamicInputProps) {
  const [inputFields, setInputFields] = React.useState<any[]>([""]);

  const handleFormChange = (index: number, event: any) => {
    let data = [...inputFields] as any;
    data[index] = event.target.files[0];
    setInputFields(data);
    getValue(data);
  };

  const addFields = () => {
    setInputFields([...inputFields, ""]);
    getValue([...inputFields, ""]);
  };

  const removeFields = (index: number) => {
    let data = [...inputFields];
    data.splice(index, 1);
    setInputFields(data);
    getValue(data);
  };

  const handleImageURL = (url: string | File) => {
    if (typeof File !== "undefined")
      if (url instanceof File) {
        return URL.createObjectURL(url);
      } else {
        return url;
      }
  };

  useEffect(() => {
    if (initialValue && initialValue?.length > 0) {
      setInputFields(initialValue);
    }
  }, [initialValue]);

  return (
    <React.Fragment>
      {/* Dynamic Fields */}
      {/* <h1 className={styles.heading}>{title}</h1> */}
      <div className={styles.grid}>
        {inputFields.map((data: any, index: number) => {
          return (
            <React.Fragment key={index}>
              <Input
                deletable
                type="file"
                name="image"
                label={`${title} Image`}
                placeholder="Enter product name"
                onDelete={() => removeFields(index)}
                style={{ width: "100%" }}
                imageUrl={handleImageURL(data?.image)}
                onChange={(e) => handleFormChange(index, e)}
              />
            </React.Fragment>
          );
        })}
        <AddMoreButton onClick={addFields} title={`Add More ${title}`} />
      </div>
    </React.Fragment>
  );
}

export default DynamicImageForm;
