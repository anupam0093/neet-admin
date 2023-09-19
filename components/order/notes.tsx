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

const Notes = ({ notesList, adminImage, user }: any) => {
  const router = useRouter();
  const { data, refetch, isFetched, isFetching } = useFetchOrderById(
    router.query?.id as string
  );

  const { mutate, mutateAsync } = useUpdateOrder(router.query?.id as string);

  const [value, setValue] = useState("");
  const [notes, setNotes] = useImmer([]);

  React.useMemo(() => {
    if (isFetched) {
      setNotes((draft) => {
        return (draft = data?.notes);
      });
    }
  }, [data?.notes, isFetched, setNotes]);

  React.useEffect(() => {
    if (notes && data?.notes) {
      mutate(
        { notes },
        {
          onSuccess: (_data) => {
            refetch();
          },
        }
      );
    }
  }, [notes]);

  const onAddNotes = React.useCallback(async () => {
    setNotes((draft: any) => {
      if (value) {
        draft.push({
          content: value,
          createdAt: new Date().toISOString(),
          createdBy: user?.name,
        });
      }
    });
    setValue("");
  }, [setNotes, user?.name, value]);

  const onDeleteNote = React.useCallback(
    (index: number) => {
      setNotes((draft) => {
        draft.splice(index, 1);
      });
    },
    [setNotes]
  );

  // FOR IAMGE

  return (
    <React.Fragment>
      
      <div
        className={styles["notes-container"]}
        style={{
          opacity: isFetching ? 0.5 : 1,
        }}
      >
        <div className={styles["field-container"]}>
          <Textarea
            label={"Add Customer Note"}
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

        {notes.length > 0 && (
          <div className={styles["notes-list"]}>
            <div className={styles["items"]}>
              {notes.map((item: any, index: number) => {
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

export default Notes;
