import Image from "next/image";
import Link from "next/link";
import css from "../../styles/newproduct/order.module.scss";
import ApplyButton from "./button/apply";
import FilterButton from "./filterbutton";
import SearchProductButton from "./searchproductbutton";
import LeftArrow from "./svgicons/leftarrow";
import RightArrow from "./svgicons/rightarrow";

interface FilterHeaderProps {
  onCreate?: () => void;
  createText: string;
}
const NewFilterHeader = ({ onCreate, createText }: FilterHeaderProps) => {
  return (
    <>
      <div className={css.productPart}>
        <div>
          <ul className={css.productInfoPart}>
            <li>
              <span className={css.current}>All</span>
              <span className={css.count}>
                <Link href="#">(604) |</Link>
              </span>
            </li>
            <li>
              <span className={css.publish}>Published </span>
              <span className={css.count}>
                <Link href="#">(348) |</Link>
              </span>
            </li>
            <li>
              <span className={css.drafts}>Drafts </span>
              <span className={css.count}>
                <Link href="#">(256) |</Link>
              </span>
            </li>
            <li>
              <span className={css.bin}>Bin</span>
              <span className={css.count}>
                <Link href="#"> (1) |</Link>
              </span>
            </li>
            <li>
              <span className={css.pillarContent}>Pillar Content</span>
              <span className={css.count}>
                <Link href="#"> (11) |</Link>
              </span>
            </li>
            <li>
              <span className={css.sorting}>Sorting</span>
            </li>
          </ul>
        </div>

        <div>
          <div className={css.searchlistproduct}>
            <div className={css.box}>
              <input type="text" placeholder="" />
            </div>
            <div>
              <SearchProductButton />
            </div>
          </div>
        </div>
      </div>

      <div className={css.subsubsubactionbtnlist}>
        <div className={css.findactionbtn}>
          <div className={css.selectcategory}>
            <select name="category" id="">
              <option value="All category">Bulk actions</option>
              <option value="All category">Edit</option>
              <option value="All category">Move to Bin</option>
            </select>
          </div>
          <div className={css.searchlistproduct}>
            <div>
              <ApplyButton />
            </div>
          </div>
        </div>
      </div>

      <div className={css.subsubsubactionbtnlist}>
        <div className={css.findactionbtn}>
          <div className={css.selectcategory}>
            <select name="category" id="">
              <option value="All category">Filter by category</option>
              <option value="All category">Archived</option>
              <option value="All category">Disabled</option>
            </select>
          </div>
          <div className={css.selectcategory}>
            <select name="category" id="">
              <option value="All category">Filter by product type</option>
              <option value="All category">Archived</option>
              <option value="All category">Disabled</option>
            </select>
          </div>
          <div className={css.selectcategory}>
            <select name="category" id="">
              <option value="All category">Filter by stock status</option>
              <option value="All category">In Stock</option>
              <option value="All category">Out Stock</option>
              <option value="All category">On Backorder</option>
            </select>
          </div>
          <div className={css.searchlistproduct}>
            <div>
              <FilterButton />
            </div>
          </div>
        </div>
      </div>

      <div>
        <ul className={css.paginationPart}>
          <li>
            <span className={css.count}>604 items</span>
          </li>
          <li>
            <LeftArrow />
          </li>
          <li>
            <LeftArrow />
          </li>
          <li>
            <div className={css.searchproduct}>
              <div className={css.box}>
                <input type="text" placeholder="" />
              </div>
            </div>
          </li>{" "}
          <li>
            <span className={css.count}>of 31</span>
          </li>
          <li>
            <RightArrow />
          </li>
          <li>
            <RightArrow />
          </li>
        </ul>
      </div>
    </>
  );
};

export default NewFilterHeader;
