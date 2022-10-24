import React, { SetStateAction } from "react";
import { BiSort } from "react-icons/bi";

import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { brandsArray, categoryArray } from "../utils/data";

interface ISortProps {
  sortBy: boolean;
  setSortBy: React.Dispatch<React.SetStateAction<boolean>>;
  handleSortByMaxPrice: () => void;
  handleSortByMinPrice: () => void;
  handleSortByMinRating: () => void;
  handleSortByMaxRating: () => void;
  sortByMaxPrice: boolean;
  sortByMinPrice: boolean;
  sortByMaxRating: boolean;
  sortByMinRating: boolean;
  // eslint-disable-next-line no-unused-vars
  categoryHandler: (e: {
    currentTarget: {
      value: SetStateAction<string>;
    };
  }) => void;
  // eslint-disable-next-line no-unused-vars
  brandHandler: (e: {
    currentTarget: {
      value: SetStateAction<string>;
    };
  }) => void;
  selectedBrand: string;
  selectedCategory: string;
  showSidebarHandler: () => void;
  hidden: boolean;
}

export const SideNavbar: React.FC<ISortProps> = ({
  selectedBrand,
  showSidebarHandler,
  hidden,
  selectedCategory,
  setSortBy,
  brandHandler,
  sortByMaxPrice,
  sortByMinPrice,
  sortBy,
  handleSortByMaxPrice,
  handleSortByMinPrice,
  handleSortByMinRating,
  handleSortByMaxRating,
  sortByMaxRating,
  sortByMinRating,
  categoryHandler,
}) => {
  return (
    <>
      <div>
        <button
          onClick={showSidebarHandler}
          className={`fixed right-0 z-10 inline-flex items-center justify-center px-3 py-2 text-md font-bold text-white bg-gray-800 border-2 rounded-r-none xl:hidden rounded-xl text-red duration-300 ease-out ${
            hidden ? "-mt-8" : "mt-0"
          } hover:bg-gray-900  hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white group`}
        >
          Sortuj
          <BiSort className="block w-6 h-6 md:hidden" aria-hidden="true" />
        </button>
        <div
          className={`fixed ${
            hidden ? "left-0" : "-left-full"
          } z-10 flex items-center w-3/4 h-screen duration-200 ease-out delay-150 bg-gray-800 rounded-lg sm:w-2/4 lg:items-start -top-0 md:w-1/4 xl:relative  xl:left-0 lg:w-60  `}
        >
          <div className="flex-col content-center p-3 text-center h-min left-full">
            <h1 className="mb-3 text-3xl font-semibold text-white">Sortuj</h1>

            <div className="flex-col pt-3 pl-1 bg-white border-2 rounded-xl">
              <div>
                <span
                  onClick={() => setSortBy(true)}
                  className={`transition-all mr-1 mt-3 text-xl cursor-pointer   my-1   ${
                    sortBy ? "font-bold" : ""
                  }`}
                >
                  Cena
                </span>{" "}
                /{" "}
                <span
                  onClick={() => setSortBy(false)}
                  className={`transition-all mr-1 mt-3 text-xl cursor-pointer   my-1   ${
                    sortBy ? "" : "font-bold"
                  }`}
                >
                  Ocena
                </span>
              </div>
              <>
                {sortBy ? (
                  <div className="flex justify-around my-3 ">
                    <button
                      onClick={handleSortByMaxPrice}
                      className={`transition-all mr-1   my-1 selected-button-price  ${
                        sortByMaxPrice ? "bg-amber-500" : "bg-amber-300"
                      }`}
                    >
                      Rosnąco <FaArrowUp className="ml-1" />
                    </button>
                    <button
                      onClick={handleSortByMinPrice}
                      className={`transition-all mr-1  my-1 selected-button-price  ${
                        sortByMinPrice ? "bg-amber-500" : "bg-amber-300"
                      }`}
                    >
                      Malejąco
                      <FaArrowDown className="ml-1" />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-around my-3 ">
                    <button
                      onClick={handleSortByMaxRating}
                      className={`transition-all mr-1   my-1 selected-button-price  ${
                        sortByMaxRating ? "bg-amber-500" : "bg-amber-300"
                      }`}
                    >
                      Rosnąco <FaArrowUp className="ml-1" />
                    </button>
                    <button
                      onClick={handleSortByMinRating}
                      className={`transition-all mr-1  my-1 selected-button-price  ${
                        sortByMinRating ? "bg-amber-500" : "bg-amber-300"
                      }`}
                    >
                      Malejąco
                      <FaArrowDown className="ml-1" />
                    </button>
                  </div>
                )}
              </>
              <h1 className="mt-3 text-xl font-semibold">Firma</h1>

              <div className="flex flex-wrap my-3 ">
                {brandsArray.map((brandName) => {
                  return (
                    <div key={brandName}>
                      <button
                        value={brandName}
                        className={`transition-all mr-1  my-1 selected-button  ${
                          brandName === selectedBrand
                            ? "bg-amber-500"
                            : "bg-amber-300"
                        }`}
                        onClick={brandHandler}
                      >
                        {brandName}
                      </button>
                    </div>
                  );
                })}
              </div>
              <h1 className="text-xl font-semibold">Kategorie</h1>
              <div className="flex flex-wrap my-3 ">
                {categoryArray.map((category) => {
                  return (
                    <React.Fragment key={category}>
                      <div>
                        <button
                          value={category}
                          className={`transition-all mr-1  my-1 selected-button  ${
                            category === selectedCategory
                              ? "bg-amber-500"
                              : "bg-amber-300"
                          }`}
                          onClick={categoryHandler}
                        >
                          {category}
                        </button>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNavbar;
