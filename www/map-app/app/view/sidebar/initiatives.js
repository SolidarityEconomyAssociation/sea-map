// The view aspects of the Main Menu sidebar
define([
  "d3",
  "app/eventbus",
  "presenter/sidebar/initiatives",
  "view/sidebar/base",
  "model/config"
], function (d3, eventbus, presenter, sidebarView, config) {
  "use strict";

  // Our local Sidebar object:
  function Sidebar() { }

  // Our local Sidebar inherits from sidebar:
  var proto = Object.create(sidebarView.base.prototype);

  // And adds some overrides and new properties of it's own:
  proto.title = "Initiatives";

  const sectionHeadingClasses =
    "w3-bar-item w3-tiny w3-light-grey w3-padding-small";
  const hoverColour = " w3-hover-light-blue";
  const accordionClasses =
    "w3-bar-item w3-tiny w3-light-grey w3-padding-small" + hoverColour;
  const sectionClasses = "w3-bar-item w3-small w3-white w3-padding-small";

  proto.populateFixedSelection = function (selection) {
    const container = selection
      .append("div")
      .attr("class", "w3-container");
    container
      .append("h1")
      .text("Search");


    this.createSearchBox(container);

    let textContent = ""; // default content, if no initiatives to show
    if (this.presenter.currentItemExists() && this.presenter.currentItem()) {
      const item = this.presenter.currentItem();
      const initiatives = item.initiatives;
      // if (initiatives.length === 1) {
      //   //textContent = initiatives[0].name;
      //   textContent = "Search: " + item.searchString;
      // } else if (item.isSearchResults()) {
      //   textContent = "Search: " + item.searchString;
      // }
      textContent = "Search: " + item.searchString;


      //change the text in the search bar
      eventbus.publish({
        topic: "Search.changeSearchText",
        data: {
          txt: item.searchedFor
        }
      });


    }


    container
      .append("p")
      .attr("id", "searchTooltipText")
      .text(textContent);

  };


  proto.geekZoneContentAtD3Selection = function (selection, initiative) {
    const that = this;
    const s = selection.append("div").attr("class", "w3-bar-block");
    if (initiative.lat) {
      s.append("div")
        .attr("class", sectionClasses)
        .text("Latitude: " + initiative.lat);
    }
    if (initiative.lng) {
      s.append("div")
        .attr("class", sectionClasses)
        .text("Longitude: " + initiative.lng);
    }
    if (initiative.uri) {
      s.append("div")
        .attr("class", sectionClasses + hoverColour)
        .text("Detailed data for this initiative")
        .style("cursor", "pointer")
        .on("click", function (e) {
          that.openInNewTabOrWindow(initiative.uri);
        });
    }
    if (initiative.within) {
      s.append("div")
        .attr("class", sectionClasses + hoverColour)
        .text("Ordnance Survey postcode information")
        .style("cursor", "pointer")
        .on("click", function (e) {
          that.openInNewTabOrWindow(initiative.within);
        });
    }
    if (initiative.regorg) {
      const serviceToDisplaySimilarCompanies =
        document.location.origin +
        document.location.pathname +
        config.getServicesPath() +
        "display_similar_companies/main.php";
      const serviceToDisplaySimilarCompaniesURL =
        serviceToDisplaySimilarCompanies +
        "?company=" +
        encodeURIComponent(initiative.regorg);
      s.append("div")
        .attr("class", sectionClasses + hoverColour)
        .attr("title", "A tech demo of federated Linked Open Data queries!")
        .text("Display similar companies nearby using Companies House data")
        .style("cursor", "pointer")
        .on("click", function (e) {
          that.openInNewTabOrWindow(serviceToDisplaySimilarCompaniesURL);
        });
    }
  };
  proto.populateSelectionWithOneInitiative = function (selection, initiative) {
    const s = selection.append("div").attr("class", "w3-bar-block");
    const that = this;
    if (initiative.www) {
      s.append("div")
        .attr("class", sectionHeadingClasses)
        .text("website");
      s.append("div")
        .attr("class", sectionClasses + hoverColour)
        .text(initiative.www)
        .style("cursor", "pointer")
        .on("click", function (e) {
          that.openInNewTabOrWindow(initiative.www);
        });
    }
    s.append("div")
      .attr("class", sectionHeadingClasses)
      .text("description");
    s.append("div")
      .attr("class", sectionClasses)
      .text(initiative.desc || "No description available");
    // Make an accordion for opening up the geek zone
    that.makeAccordionAtD3Selection({
      selection: s,
      heading: "Geek zone",
      headingClasses: accordionClasses,
      makeContentAtD3Selection: function (contentD3Selection) {
        that.geekZoneContentAtD3Selection(contentD3Selection, initiative);
      },
      hideContent: true
    });
  };

  proto.onInitiativeClicked = function (id) {
    d3.select(".sea-search-initiative-active")
      .classed("sea-search-initiative-active", false);

    d3.select('[data-uid="' + id + '"]')
      .classed(
        "sea-search-initiative-active",
        true
      );
  };

  proto.populateSelectionWithListOfInitiatives = function (
    selection,
    initiatives
  ) {
    const pres = this.presenter;
    const that = this;
    initiatives.forEach(function (initiative) {
      let initiativeClass = "w3-bar-item w3-button w3-mobile srch-initiative";

      if (initiative.nongeo == 1) {
        initiativeClass += " sea-initiative-non-geo";
      }

      selection
        .append("button")
        .attr("class", initiativeClass)
        .attr("data-uid", initiative.uniqueId)
        .attr("title", "Click to see details here and on map")
        // TODO - shift-click should remove initiative from selection,
        //        just like shift-clicking a marker.
        .on("click", function (e) {

          pres.initClicked(initiative);
        })
        .on("mouseover", function (e) {
          pres.onInitiativeMouseoverInSidebar(initiative);
        })
        .on("mouseout", function (e) {
          pres.onInitiativeMouseoutInSidebar(initiative);
        })
        .text(initiative.name);
    });
  };

  proto.changeSearchText = function (txt) {

    d3.select("#search-box").property("value", txt);

  };

  proto.createSearchBox = function (selection) {
    var view = this;

    selection = selection
      .append("form")
      .attr("id", "map-app-search-form")
      .attr(
        "class",
        "w3-card-2 w3-round map-app-search-form"
      )
      .on("submit", function () {
        // By default, submitting the form will cause a page reload!
        d3.event.preventDefault();
        //d3.event.stopPropagation();

        var searchText = d3.select("#search-box").property("value");

        view.presenter.performSearch(searchText);
      })
      .append("div")
      .attr("class", "w3-border-0");
    selection
      .append("div")
      .attr("class", "w3-col")
      .attr("title", "Click to search")
      .style("width", "50px")
      .append("button")
      .attr("type", "submit")
      .attr("class", "w3-btn w3-border-0")
      .append("i")
      .attr("class", "w3-xlarge fa fa-search");
    selection
      .append("div")
      .attr("class", "w3-rest")
      .append("input")
      .attr("id", "search-box")
      .attr("class", "w3-input w3-border-0 w3-round w3-mobile")
      .attr("type", "search")
      .attr("placeholder", "Search initiatives")
      .attr("autocomplete", "off");
    document.getElementById("search-box").focus();

  };



  proto.populateScrollableSelection = function (selection) {
    var that = this;
    var noFilterTxt = "When you search, or click on map markers, you'll see the results here";
    var freshSearchText = this.presenter.getFilterNames().length > 0 ?
      " Searching in " + this.presenter.getFilterNames().join(", ") : noFilterTxt;

    if (this.presenter.currentItemExists() && this.presenter.currentItem()) {
      const item = this.presenter.currentItem();
      const initiatives = item == null ? [] : item.initiatives;
      switch (initiatives.length) {
        case 0:
          if (item.isSearchResults()) {
            selection
              .append("div")
              .attr("class", "w3-container w3-center")
              .append("p")
              .text("Nothing matched the search");
          }
          break;
        case 1:
          //this.populateSelectionWithOneInitiative(selection, initiatives[0]);
          this.populateSelectionWithListOfInitiatives(selection, initiatives);
          break;
        default:
          this.populateSelectionWithListOfInitiatives(selection, initiatives);
      }
      // add clear button
      if (this.presenter.getFilterNames().length > 0) {
        selection
          .append("div")
          .attr("class", "w3-container w3-center")
          .attr("id", "clearSearchFilterBtn")
          .append("button")
          .attr("class", "w3-button w3-black")
          .text("Clear Filters")
          .on("click", function () {
            //redo search
            that.presenter.removeFilters();
            that.presenter.performSearch(item.searchedFor);
          });
      }
    }
    else {
      selection
        .append("div")
        .attr("class", "w3-container w3-center")
        .attr("id", "searchTooltipId")
        .append("p")
        .text(
          freshSearchText
        );
      // add clear button
      if (this.presenter.getFilterNames().length > 0) {
        selection
          .append("div")
          .attr("class", "w3-container w3-center")
          .attr("id", "clearSearchFilterBtn")
          .append("button")
          .attr("class", "w3-button w3-black")
          .text("Clear Filters")
          .on("click", function () {
            // only remove filters and and reset text, no re-search needed
            that.presenter.removeFilters();
            selection.select("#searchTooltipId").text(noFilterTxt);
            selection.select("#clearSearchFilterBtn").remove();
          });
      }
    }

  };
  proto.getWindowHeight = function () {
    return d3.select("window").node().innerHeight;
  };

  Sidebar.prototype = proto;

  function createSidebar() {
    var view = new Sidebar();
    view.setPresenter(presenter.createPresenter(view));

    return view;
  }
  var pub = {
    createSidebar: createSidebar
  };
  return pub;
});
