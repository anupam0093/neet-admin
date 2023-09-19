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

const SideContent = ({ notesList, adminImage, user }: any) => {
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

  React.useMemo(() => {
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
  const [image, updateImage] = React.useState<any>(undefined);

  const url = React.useMemo(() => {
    if (image) {
      return handleImageURL(image);
    }
    return adminImage;
  }, [adminImage, image]);

  const updateAdminImage = React.useCallback(async () => {
    const adminImage = image ? await uploadBedImage(image) : null;
    await mutateAsync(
      { adminImage },
      {
        onSuccess: (_data) => {
          alert("Image Updated");
          refetch();
        },
      }
    );
  }, [image, mutateAsync, refetch]);
  const deleteAdminImage = React.useCallback(async () => {
    updateImage(undefined);
    await mutateAsync(
      { adminImage: null },
      {
        onSuccess: (_data) => {
          alert("Image Removed");
          refetch();
        },
      }
    );
  }, [mutateAsync, refetch]);

  return (
    <React.Fragment>
      <div className={styles["imageupload"]}>
        <div className={styles["image-container"]}>
          <Input
            label="Order Image"
            type={"file"}
            onChange={({ target }: any) => {
              updateImage(target?.files[0]);
            }}
          />
          {url && (
            <React.Fragment>
              <img
                src={url}
                alt=""
                style={{
                  height: "200px",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                  margin: "10px 0px",
                }}
              />
              <Button onClick={updateAdminImage}>Update Image</Button>
              <Button onClick={deleteAdminImage}>Delete Image</Button>
            </React.Fragment>
          )}
        </div>
      </div>
      {/* <div
        className={styles["notes-container"]}
        style={{
          opacity: isFetching ? 0.5 : 1,
        }}
      >
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
        <div className={styles["field-container"]}>
          <Textarea
            label={"Add Personal Note"}
            className={styles["text-container"]}
            value={value}
            onChange={({ target }) => setValue(target.value)}
          />
          <div className={styles["mainbuttondiv"]}>
            <Button onClick={onAddNotes} className={styles["addbutton"]}>
              Add Note
            </Button>
          </div>
        </div>
      </div> */}
    </React.Fragment>
  );
};

export default SideContent;
