import React from 'react';

import Link from '../../../components/link';
import SentryTypes from '../../../proptypes';
import recreateRoute from '../../../utils/recreateRoute';

class SettingsBreadcrumb extends React.Component {
  static contextTypes = {
    organization: SentryTypes.Organization
  };

  render() {
    let {routes, params} = this.props;
    let routesWithNames = routes.filter(({name}) => name);
    let lastRouteIndex = routesWithNames.length - 1;
    return (
      <div>
        {routesWithNames.map((route, i) => {
          let isLast = i === lastRouteIndex;
          return (
            <span key={route.name}>
              <Link to={recreateRoute(route, {routes, params})}>
                {route.name}
              </Link>
              {!isLast && <span dangerouslySetInnerHTML={{__html: '&gt;'}} />}
            </span>
          );
        })}
      </div>
    );
  }
}

export default SettingsBreadcrumb;
