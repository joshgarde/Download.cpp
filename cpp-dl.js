'use strict';

(function() {
  const NAME = 'cpp-download';
  const TITLE = 'Download';

  const kdp = document.getElementById('kplayer');
  if (!kdp) return;

  function formatFlavorUrl(baseFlavorUrl, options, ks=null) {
    let url = `${baseFlavorUrl}/`;

    for (let [key, value] of Object.entries(options))
      url += `${key}/${value}/`;

    if (ks)
      url += `?ks=${ks}`

    return url;
  }

  function downloadFlavor(flavorAsset) {
    let player = window.cppdl.player;
    let kWidgetSupport = window.cppdl.kWidgetSupport;

    let baseFlavorUrl = kWidgetSupport.getBaseFlavorUrl(player.kpartnerid);
    let ks = kWidgetSupport.kClient.getKs();
    let entryId = flavorAsset.entryId;
    let flavorId = flavorAsset.id;

    let url = formatFlavorUrl(baseFlavorUrl, {
      format: 'download',
      protocol: 'https',
      entryId, flavorId
    }, ks);

    console.debug(`[CPPDL] Generated URL: ${url}`);
    window.open(url);
  }

  function injectComponent(player, component) {
    const order = 55;

    player.layoutBuilder.components[NAME] = {
      order: order,
      parent: "controlsContainer",
      o: () => {
        return component.attr({
          'data-order': order,
          'data-plugin-name': NAME
        });
      }
    };

    player.layoutBuilder.layoutContainers['controlsContainer'].push({
      id: NAME,
      order: order,
      insertMode: 'lastChild'
    });

    if (player.layoutBuilder.layoutReady)
      player.layoutBuilder.drawLayout(); // reinit layout
  }

  function initMenu(menuEl, buttonEl, flavorAssets) {
    const mw = window.cppdl.mw;

    let menu = new mw.KMenu(menuEl, {
      tabIndex: buttonEl.attr('tabindex'),
      menuName: TITLE
    });

    let sourceList = {};
    for (let flavorAsset of flavorAssets) {
      let source = flavorAsset.tags.split(',').includes('source');
      let label = source ? `${flavorAsset.height}P, ${flavorAsset.fileExt} (Source)` : `${flavorAsset.height}P, ${flavorAsset.fileExt}`

      if (label in sourceList) {
        if (sourceList[label].flavorParamsId < flavorAsset.flavorParamsId) {
          sourceList[label] = flavorAsset;
        }
      } else {
        sourceList[label] = flavorAsset;
      }
    }

    sourceList = Object.entries(sourceList).sort((a, b) => {
      if (a[1].flavorParamsId < b[1].flavorParamsId)
        return 1;

      if (a[1].flavorParamsId > b[1].flavorParamsId)
        return -1;

      return 0;
    });

    if (sourceList[sourceList.length - 1][1].flavorParamsId === 0)
      sourceList.splice(0, 0, sourceList.pop());

    for (let [label, flavorAsset] of sourceList) {
      menu.addItem({
        callback: () => {
          menu.clearActive();
          downloadFlavor(flavorAsset);
        },
        label
      });
    }

    buttonEl.click(function() {
      menu.toggle();
    });

    window.cppdl.menu = menu;
  }

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
    let $menu = $('<ul />')
      .addClass('dropdown-menu')
      .attr('aria-expanded', false);

    let $button = $('<button />')
      .addClass('btn icon-download')
      .attr({
        'title': TITLE,
        'aria-label': TITLE,
        'aria-haspopup': 'true',
        'data-show-tooltip': 'true'
      });

    initMenu($menu, $button, player.kalturaContextData.flavorAssets);

    let $component = $('<div />')
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
    }

    window.kms_playerHelper.onLoad(function() {
      kdp.addJsListener('kdpReady', 'injectCPPDl');
    });
  }
})();
