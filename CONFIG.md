
# `config.json`

This describes the schema of the `config.json` file consuming projects should supply,
and valid attributes thereof. It should be an object definition. Valid attributes are
described here. Valid attributes which are not defined in `config.json` will take a
default value. Those which are not valid are ignored.

Here is an example of what you might put in this file:

```
 {
  "namedDatasets": ["oxford"],
  "htmlTitle": "Solidarity Oxford",
  "filterableFields": [{ "field": "primaryActivity", "label": "Activities" }],
  "doesDirectoryHaveColours": true,
  "disableClusteringAtZoom": false
}
```

These values are defaults, however, which can be overridden in various ways,
as described in [README.md](README.md)

## Attributes

The following attributes can be defined.


### `aboutHtml`

- *type:* `{string}` 
- *in string context:* parsed as-is
- *default:* The contents of the consuming project's file `config/about.html`
- *settable?:* no

Raw HTML definition of the map's "about" text.




### `servicesPath`

- *type:* `{string}` 
- *in string context:* parsed as-is
- *default:* `services/`
- *settable?:* no

Preset location of the data source script(s).




### `variant`

- *type:* `{string}` 
- *in string context:* parsed as-is
- *default:* Defined by `variant` attribute of the consuming project's file `config/version.json`
- *settable?:* no

The name of the variant used to generate this map application.




### `timestamp`

- *type:* `{string}` 
- *in string context:* parsed as-is
- *default:* Defined by `variant` attribute of the consuming project's file `config/version.json`
- *settable?:* no

A timestamp string indicating when this application was deployed.




### `gitcommit`

- *type:* `{string}` 
- *in string context:* parsed as-is
- *default:* Defined by `variant` attribute of the consuming project's file `config/version.json`
- *settable?:* no

The git commit-ID of the sea-map source code deployed.




### `namedDatasets`

- *type:* `{string[]}` 
- *in string context:* A comma-delimited list of strings. No escaping is used, so no commas can exist in the strings. Spaces are not trimmed.
- *default:* `undefined`
- *settable?:* no

A list of names that correspond to directories in www/services, which must contain default-graph-uri.txt, endpoint.txt, query.rq.




### `htmlTitle`

- *type:* `{string}` 
- *in string context:* parsed as-is
- *default:* `undefined`
- *settable?:* yes

If set, this will override the default value for the map's HTML <title> tag.




### `initialBounds`

- *type:* `{number[][]}` 
- *in string context:* A comma-delimited list of four numbers defining two latitude and longitude pairs, in degrees.
- *default:* `undefined`
- *settable?:* yes

The initial bounds of the map as an array: [[n1,e1],[n2,e2]]; these are chosen automatically if this is unset




### `filterableFields`

- *type:* `{string[]}` 
- *in string context:* A comma-delimited list of strings. No escaping is used, so no commas can exist in the strings. Spaces are not trimmed.
- *default:* `undefined`
- *settable?:* yes

Defines the fields that can populate the directory




### `doesDirectoryHaveColours`

- *type:* `{boolean}` 
- *in string context:* parsed as-is
- *default:* `undefined`
- *settable?:* yes

True if the directory should feature coloured entries




### `disableClusteringAtZoom`

- *type:* `{boolean}` 
- *in string context:* parsed as-is
- *default:* `undefined`
- *settable?:* yes

Defines the zoom level to stop clustering at (an integer; or false for off)



