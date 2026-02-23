import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * @param {string} type - 'card', 'list', or 'text'
 * @param {number} count - Number of skeletons to render
 */
const HeritageSkeleton = ({ type = 'card', count = 1 }) => {
  // We use a theme that feels slightly more "Heritage" (warm greys/beige)
  const themeProps = {
    baseColor: "#ebebeb",
    highlightColor: "#f5f5f5"
  };

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="product-card skeleton-card">
            <div className="product-image-container">
              <Skeleton height="100%" />
            </div>
            <div style={{ padding: '1rem' }}>
              <Skeleton width="40%" height={15} /> {/* Metal Badge */}
              <Skeleton count={1} height={25} style={{ marginTop: '10px' }} /> {/* Title */}
              <Skeleton width="60%" height={15} /> {/* Category */}
              <Skeleton width="30%" height={20} style={{ marginTop: '10px' }} /> {/* Price */}
              <Skeleton height={40} style={{ marginTop: '15px' }} /> {/* Button */}
            </div>
          </div>
        );

      case 'list':
        return (
          <div style={{ display: 'flex', gap: '15px', padding: '10px', borderBottom: '1px solid #eee' }}>
            <Skeleton width={80} height={80} borderRadius={8} />
            <div style={{ flex: 1 }}>
              <Skeleton width="50%" height={20} />
              <Skeleton width="30%" height={15} style={{ marginTop: '10px' }} />
            </div>
          </div>
        );

      case 'text':
        return (
          <div style={{ marginBottom: '1rem' }}>
            <Skeleton height={30} width="60%" style={{ marginBottom: '10px' }} />
            <Skeleton count={3} />
          </div>
        );

      default:
        return <Skeleton count={count} />;
    }
  };

  return (
    <SkeletonTheme {...themeProps}>
      {Array(count).fill(0).map((_, i) => (
        <React.Fragment key={i}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </SkeletonTheme>
  );
};

export default HeritageSkeleton;