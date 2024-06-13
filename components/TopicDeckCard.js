import Link from 'next/link';
import LoadingSpinner from './LoadingSpinner';
import EmptyMessage from './EmptyMessage';
import { PAGES } from '../utils/constants';

function TopicDeckCard({ isLoading, isEmpty, item = [] }) {
  return (
    <>
      <div class="mb-3">
        {isLoading && <LoadingSpinner />}
        {isEmpty && <EmptyMessage />}
        {!isEmpty && (
          <div class="row">
            {item.map((item, index) => (
              <div class="col" key={index}>
                <div class="card card-move hover-border">
                  <div class="card-body">
                    <h5 class="card-title crop-text mb-0">-</h5>
                    <h8 class="card-subtitle mb-2 text-muted">-</h8>
                    <p class="card-text mt-1 crop-text">-</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Link href={`${PAGES.jobs.directory}`} class="nav-link">
        <h6 class="text-primary text-end" data-lang-key="global.see_more">
          See More <i class="bi bi-arrow-right-short"></i>
        </h6>
      </Link>
    </>
  );
}

export default TopicDeckCard;
