# Ogre

Ogre is a `GDAL`'s helper `ogr2ogr` as a service.

## Installation

```shell
$ git clone git@github.com:stepankuzmin/ogre.git
$ cd ogre
$ npm install
$ npm start
```

## Usage

1. Convert local file `POLYGON.mif` to `POLYGON.geojson`

```shell
$ curl "http://localhost:3000/?input=POLYGON.mif&output=POLYGON.geojson"
```
