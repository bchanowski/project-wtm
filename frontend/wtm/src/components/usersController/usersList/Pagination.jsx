import ReactPaginate from "react-paginate";
import "./UsersList.css";

export default function Pagination({
  postsPerPage,
  totalPosts,
  paginate,
  currentPage,
}) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const onPageClick = (e) => {
    paginate(e.selected + 1);
  };

  return (
    <nav className="nav-pagination-user-list">
      <ReactPaginate
        className="pagination-numbers-list"
        breakLabel="..."
        nextLabel=">"
        previousLabel="<"
        pageCount={pageNumbers.length}
        renderOnZeroPageCount={null}
        pageRangeDisplayed={5}
        forcePage={currentPage - 1}
        onPageChange={onPageClick}
      />
    </nav>
  );
}
