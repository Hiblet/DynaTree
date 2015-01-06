# DynaTree #

A JavaScript only control to produce a simple tree, that can be used to select items.
Design aim was to be able to build the tree from any inbound data object (hence dynamic) with simple lightweight code.



## Overview ##

The control is passed any JavaScript object, and then dynamically builds a tree based on the structure of that object.
The tree is used to select items, in either multi-select or single-select mode.
The control can be initialised with a starting array, which applies check marks to any checkboxes that match items in the tree.
The tree can be queried to retrieve the currently checked leaves, branches or both.
A callback function can be passed that is called whenever any of the checkboxes changes, with the intention of allowing the client app to save the current selection or act upon the change.
Leaf nodes can be made to be links.  Leaf nodes can either display JS property values as text, or as a tooltip.
Options to show checkboxes for branches and leaves can be independently controlled.
Formatting and styling is controlled through CSS.



## Example Usage ##

First, create a Javascript object. 
You can the optionally create a style definition object to control tree styles, that maps your CSS styles to expected properties of the tree.
Create a div (or other container object) that you want to attach the tree to at run-time.
Decide the options:
 - Checkboxes on Branch nodes
 - Checkboxes on Leaf nodes
 - Multi or Single select mode
 - Leaf property values to be displayed as text with the property key, or as a tooltip
Pass the data object, container, style and options parameters to the Build function.
Once built, the tree can be initialised by passing branch paths or leaf node names, so that the relevant checkboxes take their saved state.
Then a callback function can be set to react to checkbox changes, which will usually involve triggering a request to the tree to report currently checked leaves or branches, or both.


## Getting Started ##

You will need the DynaTree.js file and FCUtils.js file in your project, and you will need references to them in your HTML script, as you would for any JS plugin.
With those in place you should be able to call the nz.dynatree.Build() function.


## Example Project ##

The testing and example project is a minimal Visual Studio 2010 Asp.Net website.
The website default page code-behind is used to build a data object similar to my operational data, but 
any source JS object should be handled.
The Default.js file shows the creation, initialisation, callback and linkifying of the tree.


## Implementation ##

The tree is built as a nested set of unordered list elements (HTML tag 'ul').  
Each list item (HTML tag 'li') can contain an unordered list.
This means that indentation is controlled by one margin setting in CSS.
Settings for each tree are stored in a config variable that is named after the tree, so
the control should support multiple instances without conflict, provided each tree is given a unique name.


## Licensing ##

All contained code in the DynaTree.js file is my own code.  
The FCUtils.js file contains code adapted from O'Reilly's JavaScript book by David Flanagan.
Free to use, but please give credit.


## Rough Notes ##

Objects passed in can be any JavaScript object, including arrays:

    var o = 
	{
	    foo: "bar",
		arr: [1, 2, 3],
		subo: {
		foo2: "bar2"
		}
    };

In JS, Arrays are represented as objects where properties are the numeric indices.
Therefore an array is handled automatically, and the tree shows branches with index values.


    /* Array Format Notation */
    
    var o =
		{
			"Node_1": {
				"Node_1.1": "Data_1.1"
			},
			"Node_2": [
				{
					"Node_2.1": "Data_2.1"
				},
				{
					"Node_2.2": "Data_2.2"
				},
				{
					"Node_2.3": [
						{
							"Node_2.3.1": "Data_2.3.1"
						},
						{
							"Node_2.3.2": "Data_2.3.2"
						}
					]
				}
			],
			"Node_3": [
				{
					"Node_3.1": "Data_3.1"
				}
			]
		};
    

    /* Property format notation approximating arrays - or how arrays are really stored */
    var o =
		{
		"Node_1": {
			"Node_1.1": "Data_1.1"
		},
		"Node_2": {
			"0": {
				"Node_2.1": "Data_2.1"
			},
			"1": {
				"Node_2.2": "Data_2.2"
			},
			"2": {
				"Node_2.3": {
					"0": {
						"Node_2.3.1": "Data_2.3.1"
					},
					"1": {
						"Node_2.3.2": "Data_2.3.2"
					}
				}
			}
		},
		"Node_3": {
			"0": {
				"Node_3.1": "Data_3.1"
			}
		}
	};

    /* What I use */
    
    var o =
	{
		"Node_1": {
			"Node_1.1": "Data_1.1"
		},
		"Node_2": {
			"Node_2.1": "Data_2.1",
			"Node_2.2": "Data_2.2",
			"Node_2.3": {
				"Node_2.3.1": "Data_2.3.1",
				"Node_2.3.2": "Data_2.3.2"
			}
		},
		"Node_3": {
			"Node_3.1": "Data_3.1"
		}
	};
    

