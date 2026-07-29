<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next, ...$roles)
    {

        if (! auth()->check()) {
            abort(403, 'Unauthorized.');
        }

        if (! in_array(auth()->user()->role, $roles)) {
            abort(403, 'Access denied.');
        }

        return $next($request);
    }
}
