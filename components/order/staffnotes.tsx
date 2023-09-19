/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "styles/order.module.scss";
import { useFetchOrderById } from "network-requests/queries";
import { useUpdateOrder } from "network-requests/mutations";
import "react-toastify/dist/ReactToastify.css";
import Textarea from "components/element/textarea";
import Button from "components/element/button";
import { useImmer } from "use-immer";
import Input from "components/element/input";
import handleImageURL from "constants/image-convert";
import { uploadBedImage } from "network-requests/api";
import moment from "moment";

const StaffNotes = ({ notesList, adminImage, user }: any) => {
  const router = useRouter();
  const { data, refetch, isFetched, isFetching } = useFetchOrderById(
    router.query?.id as string
  );

  const { mutate, mutateAsync } = useUpdateOrder(router.query?.id as string);

  const [value, setValue] = useState("");
  const [staffnotes, setStaffNotes] = useImmer([]);

  React.useMemo(() => {
    if (isFetched) {
      setStaffNotes((draft) => {
        return (draft = data?.staffnotes);
      });
    }
  }, [data?.staffnotes, isFetched, setStaffNotes]);

  React.useEffect(()=>{
    if (staffnotes && data?.staffnotes) {
      mutate(
        { staffnotes },
        {
          onSuccess: (_data) => {
            refetch();
          },
        }
      );
    }
  }, [staffnotes]);

  const onAddNotes = React.useCallback(async () => {
    setStaffNotes((draft: any) => {
      if (value) {
        draft.push({
          content: value,
          createdAt: new Date().toISOString(),
          createdBy: user?.name,
        });
      }
    });
    setValue("");
  }, [setStaffNotes, user?.name, value]);

  const onDeleteNote = React.useCallback(
    (index: number) => {
      setStaffNotes((draft) => {
        draft.splice(index, 1);
      });
    },
    [setStaffNotes]
  );

  // FOR IAMGE

  return (
    <React.Fragment>
      
      <div
        className={styles["staffnotes-container"]}
        style={{
          opacity: isFetching ? 0.5 : 1,
        }}
      >
        <div className={styles["stafffield-container"]}>
          <Textarea
            label={"Add Staff Note"}
            className={styles["text-container"]}
            value={value}
            onChange={({ target }) => setValue(target.value)}
          />
          <div className={styles["mainbuttondiv"]}>
            <Button onClick={onAddNotes} className={styles["addbutton"]}>
              Add Note
            </Button>
            {/* <Button onClick={onUpadateNotes} className={styles["updatebutton"]}>
                Update Note{" "}
              </Button> */}
          </div>
        </div>

        {staffnotes.length > 0 && (
          <div className={styles["staffnotes-list"]}>
            <div className={styles["items"]}>
              {staffnotes.map((item: any, index: number) => {
                return (
                  <React.Fragment key={index}>
                    <p>
                      {item?.content}{" "}
                      <span onClick={() => onDeleteNote(index)}>Delete</span>
                    </p>
                    <span className={styles["notedate"]}>
                      At {moment(item?.createdAt).format("DD MMM YY - hh:mm A")}{" "}
                      by {item?.createdBy}
                    </span>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default StaffNotes;
