import React, { FC } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    RouteProps,
} from "react-router-dom";

export interface WithRouteProps {
    routes: RouteProps | RouteProps[],
}

const WithRoute: FC<WithRouteProps> = React.memo(({
    routes,
}: WithRouteProps) => {
    if (Array.isArray(routes)) {
        return (
            <Switch>
                {routes.map((props, key) => (
                    <Route key={key} {...props} />
                ))}
            </Switch>
        )
    }

    return (
        <Switch>
            <Route {...routes} />
        </Switch>
    )
});

export default WithRoute;