<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});


Broadcast::channel('owner.{ownerId}', function ($user, $ownerId) {
    return (int) $user->id === (int) $ownerId
        && $user->role === 'owner';
});
