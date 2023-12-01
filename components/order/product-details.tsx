/* eslint-disable @next/next/no-img-element */
import { useMemo } from 'react';
import { OrderItems } from 'network-requests/types';
import styles from 'styles/order.module.scss';

interface OrderListProps {
  data: OrderItems;
  extraDeliveryname: string;
  extraDeliveryprice: number;
}

const notToShow = ['low-divan-bed'];

const ProductDetails = ({
  data,
  extraDeliveryname,
  extraDeliveryprice,
}: OrderListProps) => {
  const accessories = data?.accessories;
  const mattress = accessories?.mattress;
  const headboard = accessories?.headboard;
  const feet = accessories?.feet;
  const storage = accessories?.storage;
  const gaslift = accessories?.gaslift;
  const size = accessories?.size;
  const isDivanbed = useMemo(() => {
    return !data?.categories?.find((item: any) => notToShow?.includes(item));
  }, [data]);

  console.log('accessories', data);
  return (
    <>  
      <div className={styles.mainsectionlist2}>
        <table>
          <tbody>
            <tr className={styles.total_cal}>
              <td>Image</td>
              <td>Product</td>
              <td>Total cost</td>
              <td>Qty</td>
              <td>Grand total</td>
            </tr>
            <tr>
              <td>
                <img
                  src={data?.accessories?.color?.image || data?.image}
                  alt="image"
                  className={`border-radius-4`}
                />
              </td>
              <td>
                <a>
                  {data?.name} {data?.size}
                </a>
              </td>
              <td>£{data.price / data.quantity}</td>
              <td>× {data?.quantity}</td>
              <td>£ {data?.price}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.singleorderpage}>
        <div className={styles.productdetailslist}>
          <table>
            <tbody>
              <tr>
                <th>Product</th>
                <th>Option</th>
                <th>Cost</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
              {size?.name && (
                <tr>
                  <td>Select Your Size</td>
                  <td>{size?.name}</td>
                  <td>£{size?.price}</td>
                  <td>
                    1 <small> (1×1)</small>
                  </td>
                  <td>£{size?.price}</td>
                </tr>
              )}
              {mattress?.name && (
                <tr>
                  <td>Select Your Mattress</td>
                  <td>{mattress?.name}</td>
                  <td>£{mattress?.price}</td>
                  <td>
                    1 <small>(1x1)</small>
                  </td>
                  <td>£{mattress?.price || 0}</td>
                </tr>
              )}
               {gaslift?.name && (
                <tr>
                  <td>Select Your Gas Lift</td>
                  <td>{gaslift?.name}</td>
                  <td>£{gaslift?.price}</td>
                  <td>
                    1 <small>(1x1)</small>
                  </td>
                  <td>£{gaslift?.price || 0}</td>
                </tr>
              )}
              {headboard && (
                <tr>
                  <td>Select Your Headboard</td>
                  <td>{headboard?.name || 'No Headboard'}</td>
                  <td>£{headboard?.price || 0}</td>
                  <td>
                    1 <small>(1×1)</small>
                  </td>
                  <td>£{headboard?.price || 0}</td>
                </tr>
              )}
              {isDivanbed && feet && (
                <tr>
                  <td>Select Your Feet</td>
                  <td>{feet?.name}</td>
                  <td>£{feet?.price || 0}</td>
                  <td>
                    1 <small>(1×1)</small>
                  </td>
                  <td>£{feet?.price || 0}</td>
                </tr>
              )}
              {isDivanbed && storage && (
                <tr>
                  <td>Storage Options</td>
                  <td>{storage?.name }</td>
                  <td>£{storage?.price || 0}</td>
                  <td>
                    1 <small>(1×1)</small>
                  </td>
                  <td>£{storage?.price }</td>
                </tr>
              )}
             
             {data?.accessories?.color && <tr>
                <td>Choose Colour</td>
                <td>
                  {/* <img
                    src={data?.accessories?.color?.image || data?.image}
                    alt="color"
                    className={`border-radius-4`}
                  /> */}
                  <span>{data?.accessories?.color?.name}</span>
                </td>
                <td>£0.00</td>
                <td>
                  1 <small>(1×1)</small>
                </td>
                <td>£0.00</td>
              </tr>}
            </tbody>
          </table>
        </div>
      </div>

      <tbody>
        {/* <div className={styles.free_ship}>
          <tr>
            <p>
              <td>Free Shipping</td>
              <td>£0.00</td>
            </p>
          </tr>
        </div> */}
        <div className={styles.free_ship}>
          <tr>
            <p>
              <td>Free Shipping</td>
              <td>£0.00</td>
            </p>
          </tr>
        </div>
      </tbody>
      <tbody>
        {extraDeliveryprice > 0 &&<div className={styles.free_ship}>
          <tr>
            <p>
              {extraDeliveryname &&<td>
                {extraDeliveryname}   </td>}
              <td>
                {extraDeliveryprice > 0 ? `£${extraDeliveryprice}` : ''}
              </td>
            </p>
          </tr>
        </div>}
      </tbody>
    </>
  );
};

export default ProductDetails;
