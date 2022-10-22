import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';
import _ from 'underscore';
import ReactDOM from 'react-dom';
import ReviewTile from './ReviewTile.jsx';
import Modal from './Modal.jsx';
import ReviewSubmissionForm from './ReviewSubmissionForm.jsx';

function ReviewList({ productId, filters, characteristics }) {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('relevant');
  const [displayCount, setDisplayCount] = useState(2);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  const sorts = {
    newest: (a, b) => {
      const dateA = Date.parse(a.date);
      const dateB = Date.parse(b.date);
      if (dateA > dateB) {
        return -1;
      }
      if (dateB < dateA) {
        return 1;
      }
      return 0;
    },
    helpful: (a, b) => {
      if (a.helpfulness > b.helpfulness) {
        return -1;
      }
      if (b.helpfulness < a.helpfulness) {
        return 1;
      }
      return 0;
    },
  };

  useEffect(() => {
    if (productId !== undefined) {
      Axios.get(
        `/reviews?product_id=${productId}&sort=relevant&page=${page}&count=100`
      ).then((response) => {
        setPage(page + 1);
        setReviews(
          _.uniq(
            [...reviews, ...response.data.results],
            (review) => review.review_id
          )
        );
      });
    }
  }, [productId, reviews.length]);

  const displayList = [...reviews]
    .filter((review) => {
      if (filters.length === 0) {
        return true;
      }
      if (filters.includes(review.rating.toString())) {
        return true;
      }
      return false;
    })
    .sort(sorts[sort])
    .slice(0, displayCount)
    .map((review) => <ReviewTile review={review} key={review.review_id} />);

  return (
    <>
      <div className="review-sort-bar">
        <p>Sorted on:</p>
        <select
          onChange={(e) => {
            setSort(e.target.value);
            setDisplayCount(2);
          }}
        >
          <option value="relevant">Relevant</option>
          <option value="newest">Newest</option>
          <option value="helpful">Helpful</option>
        </select>
      </div>
      {displayList}
      {displayCount < reviews.length && (
        <button
          type="button"
          onClick={() => {
            setDisplayCount(displayCount + 2);
          }}
          className="review-list-button"
        >
          MORE REVIEWS
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          setShowSubmissionForm(true);
        }}
        className="review-list-button"
      >
        ADD A REVIEW +
      </button>
      {showSubmissionForm && (
        <Modal>
          <ReviewSubmissionForm
            close={() => setShowSubmissionForm(false)}
            characteristics={characteristics}
            productId={productId}
          />
        </Modal>
      )}
    </>
  );
}

ReviewList.propTypes = {
  productId: PropTypes.number,
  filters: PropTypes.arrayOf(PropTypes.string),
  characteristics: PropTypes.object,
};

ReviewList.defaultProps = {
  productId: undefined,
  characteristics: {},
  filters: [],
};

export default ReviewList;
