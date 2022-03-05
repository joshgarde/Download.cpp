'use strict';

(function() {
  const NAME = 'cpp-download';
  const TITLE = 'Download';

  const kdp = document.getElementById('kplayer');
  if (!kdp) return;

  /**
   * Generates a flavor URL based on the base url + options
   * @param {string} baseFlavorUrl the base url provided by kWidgetSupport
   * @param {object} options a map of options to set in the url
   * @param {string} ks the keystring used for authentication
   * @return {string} the generated url
   */
  function formatFlavorUrl(baseFlavorUrl, options, ks=null) {
    let url = `${baseFlavorUrl}/`;

    for (const [key, value] of Object.entries(options)) {
      url += `${key}/${value}/`;
    }

    if (ks) url += `?ks=${ks}`;
    return url;
  }

  /**
   * Downloads a flavor asset by generating a flavor URL
   * @param {object} flavorAsset an object describing a flavor asset
   */
  function downloadFlavor(flavorAsset) {
    const player = window.cppdl.player;
    const kWidgetSupport = window.cppdl.kWidgetSupport;

    const baseFlavorUrl = kWidgetSupport.getBaseFlavorUrl(player.kpartnerid);
    const ks = kWidgetSupport.kClient.getKs();
    const entryId = flavorAsset.entryId;
    const flavorId = flavorAsset.id;

    const url = formatFlavorUrl(baseFlavorUrl, {
      format: 'download',
      protocol: 'https',
      entryId, flavorId,
    }, ks);

    console.debug(`[CPPDL] Generated URL: ${url}`);
    window.open(url);
  }

  /**
   * Injects a component into a player element
   * @param {object} player a kplyaer element
   * @param {object} component a jQuery element to inject
   */
  function injectComponent(player, component) {
    const order = 55;

    player.layoutBuilder.components[NAME] = {
      order: order,
      parent: 'controlsContainer',
      o: () => {
        return component.attr({
          'data-order': order,
          'data-plugin-name': NAME,
        });
      },
    };

    player.layoutBuilder.layoutContainers['controlsContainer'].push({
      id: NAME,
      order: order,
      insertMode: 'lastChild',
    });

    if (player.layoutBuilder.layoutReady) {
      player.layoutBuilder.drawLayout(); // reinit layout
    }
  }

  /**
   * Initializes a menu el with download options
   * @param {object} menuEl a jQuery menu element
   * @param {object} buttonEl a jQuery button element
   * @param {array} flavorAssets an array of flavor assets
   */
  function initMenu(menuEl, buttonEl, flavorAssets) {
    const mw = window.cppdl.mw;

    const menu = new mw.KMenu(menuEl, {
      tabIndex: buttonEl.attr('tabindex'),
      menuName: TITLE,
    });

    let sourceList = {};
    for (const flavorAsset of flavorAssets) {
      const source = flavorAsset.tags.split(',').includes('source');
      let label = `${flavorAsset.height}P, ${flavorAsset.fileExt}`;
      if (source) label += ' (Source)';

      if (label in sourceList) {
        if (sourceList[label].flavorParamsId < flavorAsset.flavorParamsId) {
          sourceList[label] = flavorAsset;
        }
      } else {
        sourceList[label] = flavorAsset;
      }
    }

    sourceList = Object.entries(sourceList).sort((a, b) => {
      if (a[1].flavorParamsId < b[1].flavorParamsId) return 1;
      if (a[1].flavorParamsId > b[1].flavorParamsId) return -1;
      return 0;
    });

    if (sourceList[sourceList.length - 1][1].flavorParamsId === 0) {
      sourceList.splice(0, 0, sourceList.pop());
    }

    for (const [label, flavorAsset] of sourceList) {
      menu.addItem({
        callback: () => {
          menu.clearActive();
          downloadFlavor(flavorAsset);
        },
        label,
      });
    }

    buttonEl.click(function() {
      menu.toggle();
    });

    window.cppdl.menu = menu;
  }

  /** Injects the download button into Kaltura - main entry point **/
  function injectButton() {
    const frame = document.getElementById('kplayer_ifp');
    if (!frame) {
      console.error('[CPPDL] kplayer_ifp missing!');
      return;
    }

    const $ = frame.contentWindow.$;
    const mw = frame.contentWindow.mw;
    const kWidgetSupport = frame.contentWindow.kWidgetSupport;
    const player = frame.contentDocument.getElementById('kplayer');

    // Expose iframe vars to top-level
    window.cppdl = {mw, player, kWidgetSupport};

    /* Setup UI */
    const $menu = $('<ul />')
        .addClass('dropdown-menu')
        .attr('aria-expanded', false);

    const $button = $('<button />')
        .addClass('btn icon-download')
        .attr({
          'title': TITLE,
          'aria-label': TITLE,
          'aria-haspopup': 'true',
          'data-show-tooltip': 'true',
        });

    initMenu($menu, $button, player.kalturaContextData.flavorAssets);

    const $component = $('<div />')
        .addClass(`dropup comp ${NAME} pull-right display-high`)
        .append($button, $menu);

    injectComponent(player, $component);

    console.debug('[CPPDL] inject done');
  }

  if (window.playerLoaded) {
    injectButton();
  } else {
    window.injectCPPDl = function() {
      delete window.injectCPPDl;
      injectButton();
    };

    window.kms_playerHelper.onLoad(function() {
      kdp.addJsListener('kdpReady', 'injectCPPDl');
    });
  }
})();
