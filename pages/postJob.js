import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import GlobalButton from '../components/GlobalButton';
import { useModal } from '../context/modal';
import { useApiCall } from '../context/apiCall';
import { PAGES } from '../utils/constants';
import { useRouter } from 'next/router';
import AnimatedComponent from '../components/AnimatedComponent';

const main = () => {
  const { toggleModal } = useModal();
  const { apiData } = useApiCall();
  const router = useRouter();

  const logedIn = apiData.user.data?.id && !apiData.user.isLoading;

  return (
    <div className="body">
      <section class="container text-center">
        <AnimatedComponent stageIndex={1} animateByIndex={true}>
          <h1 class="display-2">
            <strong>
              We help you <span class="text-primary">easily</span> post <br />
              your job ads!
            </strong>
          </h1>
        </AnimatedComponent>
        <AnimatedComponent stageIndex={2} animateByIndex={true}>
          <p class="lead text-muted mt-4">
            We know finding the perfect candidates is crucial,
            <br /> and we're here to make it easy for you.
          </p>
        </AnimatedComponent>
        <AnimatedComponent stageIndex={3} animateByIndex={true}>
          <div class="mt-3 mb-3">
            <Image
              src="/images/home-ads-send.png"
              alt="image"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: 500, height: 'auto' }}
              class="d-inline-block align-text-top"
            />
          </div>
        </AnimatedComponent>
        <AnimatedComponent stageIndex={4} animateByIndex={true}>
          <GlobalButton
            btnType="button"
            btnClass="btn btn-primary btn-lg mt-4"
            btnOnClick={() => {
              if (logedIn) {
                router.push(PAGES.job_post.directory);
              } else {
                toggleModal('auth');
              }
            }}
          >
            <i class="bi bi-send-fill me-1" /> Start Post a Job
          </GlobalButton>
        </AnimatedComponent>
      </section>
    </div>
  );
};

export default main;
