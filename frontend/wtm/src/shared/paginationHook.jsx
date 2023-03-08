import { useEffect, useState } from "react";

const usePagination = (elements, elementsPerPage = 5) => {
  const [pageElements, setPageElements] = useState(null);
  const [numberOfPages, setNumberOfPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const movePage = (moveDirection, goByOne = true) => {
    if (
      +currentPage === +numberOfPages &&
      +moveDirection === 1 &&
      goByOne === true
    )
      return;
    if (+currentPage === 1 && +numberOfPages === 1) return;
    if (+currentPage === 1 && +moveDirection === -1) return;

    let newCurrentPage;
    if (!!goByOne) {
      newCurrentPage = currentPage + moveDirection;
    } else {
      newCurrentPage = moveDirection;
    }

    setCurrentPage(newCurrentPage);

    let sliceStart = 0;
    let sliceEnd = elementsPerPage;

    if (newCurrentPage !== 1) {
      sliceStart = (newCurrentPage - 1) * elementsPerPage;
      sliceEnd = sliceStart + elementsPerPage;
    }

    setPageElements(elements.slice(sliceStart, sliceEnd));
  };

  useEffect(() => {
    if (!elements?.length) return;
    const shiftsLength = elements.length;
    const shiftsSlice = elements.slice(0, elementsPerPage);
    setPageElements(shiftsSlice);
    const numOfPages = Math.ceil(shiftsLength / elementsPerPage);
    setNumberOfPages(numOfPages);
  }, [elements]);

  return {
    movePage,
    pageElements,
    currentPage,
    numberOfPages,
  };
};

export default usePagination;
