import Link from 'next/link';
import LoadingSpinner from './LoadingSpinner';
import EmptyMessage from './EmptyMessage';
import { PAGES } from '../utils/constants';
import CompanyCard from './CompanyCard';
import AnimatedComponent from './AnimatedComponent';

function CompanyDeckCard({ isLoading, isEmpty, item = [] }) {
  return (
    <>
      <div class="mb-3">
        <LoadingSpinner isLoading={isLoading} />
        {isEmpty && <EmptyMessage />}
        {!isEmpty && (
          <div class="row row-cols-1 row-cols-md-3 g-4">
            {item.map((item, index) => (
              <AnimatedComponent
                key={index}
                stageIndex={index}
                animateByIndex={true}
              >
                <div class="col">
                  <CompanyCard item={item} />
                </div>
              </AnimatedComponent>
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

export default CompanyDeckCard;
