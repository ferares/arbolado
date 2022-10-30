@extends('layouts.default')

@section('view-scripts')
  <script>
    window.env = {
      mapboxToken: '{{ $mapboxToken }}',
    }
  </script>
@stop

@section('content')
  @include('partials.map-aside')
  @include('partials.map')
  @include('partials.tree')
  @include('components.drawer')
@stop
