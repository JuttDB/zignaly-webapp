import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { isEqual, keys, size } from "lodash";
import HelperLabel from "../HelperLabel/HelperLabel";
import { Button, Box, OutlinedInput, Typography, Switch } from "@material-ui/core";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import { useFormContext } from "react-hook-form";
import { formatFloat2Dec } from "../../../utils/format";
import useExpandable from "../../../hooks/useExpandable";
import useTargetGroup from "../../../hooks/useTargetGroup";
import useSymbolLimitsValidate from "../../../hooks/useSymbolLimitsValidate";
import { calculateDcaPrice } from "../../../utils/calculations";
import DCATargetStatus from "../DCATargetStatus/DCATargetStatus";
import usePositionEntry from "../../../hooks/usePositionEntry";
import "./DCAPanel.scss";
import useValidation from "../../../hooks/useValidation";
import useDeepCompareEffect from "../../../hooks/useDeepCompareEffect";

/**
 * @typedef {import("../../../services/coinRayDataFeed").MarketSymbol} MarketSymbol
 * @typedef {import("../../../services/coinRayDataFeed").CoinRayCandle} CoinRayCandle
 * @typedef {import("../../../services/tradeApiClient.types").PositionEntity} PositionEntity
 */

/**
 * @typedef {Object} DCAPanelProps
 * @property {MarketSymbol} symbolData
 * @property {PositionEntity} [positionEntity] Position entity (optional) for position edit trading view.
 * @property {boolean} [isReadOnly] Flag to disable edition.
 */

/**
 * Manual trading take profit panel component.
 *
 * @param {DCAPanelProps} props Component props.
 * @returns {JSX.Element} Take profit panel element.
 */
const DCAPanel = (props) => {
  const { positionEntity, symbolData, isReadOnly = false } = props;
  const {
    clearErrors,
    errors,
    register,
    setValue,
    watch,
    trigger,
    formState: { dirtyFields },
  } = useFormContext();
  const rebuyTargets = positionEntity ? positionEntity.reBuyTargets : {};
  const { getEntryPrice, getEntrySizeQuote } = usePositionEntry(positionEntity);
  const { formatMessage } = useIntl();
  const { lessThan } = useValidation();

  /**
   * @typedef {Object} PositionDcaIndexes
   * @property {number} dcaRebuyDoneCount
   * @property {Array<string>} dcaAllIndexes
   * @property {Array<string>} dcaRebuyIndexes
   * @property {Array<string>} dcaIncreaseIndexes
   */

  /**
   * Extract indexes for Rebuys and Increase position DCAs target.
   *
   * Increase positions are tracked as DCAs starting in index 1000:
   *   - Targets from 1 until 999 are reBuys.
   *   - Targets equal or greater than 1000 are increased position.
   *
   * @returns {PositionDcaIndexes} DCA indexes data.
   */
  const resolveDcaIndexes = () => {
    const dcaAllIndexes = keys(rebuyTargets).map(Number);
    const dcaRebuyIndexes = dcaAllIndexes.filter((index) => index < 1000);
    const dcaIncreaseIndexes = dcaAllIndexes.filter((index) => index >= 1000);
    const dcaRebuyTargets = positionEntity
      ? dcaRebuyIndexes.map((index) => rebuyTargets[index])
      : [];
    const dcaRebuyDoneCount = dcaRebuyTargets.filter((target) => target.done === true).length;

    return {
      dcaRebuyDoneCount,
      dcaAllIndexes: dcaAllIndexes.map(String),
      dcaRebuyIndexes: dcaRebuyIndexes.map(String),
      dcaIncreaseIndexes: dcaIncreaseIndexes.map(String),
    };
  };

  const {
    dcaRebuyDoneCount,
    dcaAllIndexes,
    dcaRebuyIndexes,
    dcaIncreaseIndexes,
  } = resolveDcaIndexes();
  const [activeDcaIncreaseIndexes, setActiveDCAIncreaseIndexes] = useState(dcaIncreaseIndexes);
  const positionTargetsCardinality = positionEntity
    ? Math.max(dcaIncreaseIndexes.length ? 0 : 1, size(dcaRebuyIndexes))
    : 1;
  const { expanded, expandClass, setExpanded } = useExpandable(size(dcaAllIndexes) > 0);

  const {
    cardinality,
    cardinalityRange,
    composeTargetPropertyName,
    getTargetPropertyValue,
    handleTargetAdd,
    handleTargetRemove,
    setTargetPropertyValue,
  } = useTargetGroup("dca", positionTargetsCardinality);

  const {
    validateTargetPriceLimits,
    validateCostLimits,
    validateUnitsLimits,
  } = useSymbolLimitsValidate(symbolData);

  const isClosed = positionEntity ? positionEntity.closed : false;
  const isDoneTargetReached = cardinality >= 1 && cardinality - 1 < dcaRebuyDoneCount;
  const disableRemoveAction = isReadOnly || isDoneTargetReached || cardinality === 0;
  const entryType = positionEntity ? positionEntity.side : watch("entryType");
  const strategyPrice = watch("price");
  const strategyPositionSize = watch("positionSize");

  /**
   * Handle DCA increase remove.
   *
   * @param {React.MouseEvent<HTMLButtonElement>} event Button click event.
   * @returns {Void} None.
   */
  const handleDcaIncreaseRemove = (event) => {
    const targetElement = event.currentTarget;
    const targetId = targetElement.getAttribute("data-target-id");
    const newDcaIncreaseIndexes = activeDcaIncreaseIndexes.filter((value) => value !== targetId);
    setActiveDCAIncreaseIndexes(newDcaIncreaseIndexes);
  };

  /**
   * @typedef {Object<string, boolean>} DcaFlagIndex
   */

  /**
   * Create an index of DCA execution for existing DCAs.
   *
   * @returns {DcaFlagIndex} DCAs execution index.
   */
  const getDcaExecutionIndex = () => {
    /**
     * @type {DcaFlagIndex}
     */
    const dcaExecutionIndex = {};
    dcaAllIndexes.forEach((index) => {
      if (positionEntity) {
        const target = positionEntity.reBuyTargets[Number(index)];
        dcaExecutionIndex[index] = false;

        if (target.done || target.skipped) {
          dcaExecutionIndex[index] = true;
        }
      }
    });

    return dcaExecutionIndex;
  };

  /**
   * Create an index of DCA target fields that should be disabled (read-only).
   *
   * @returns {DcaFlagIndex} DCA target fields disable status index.
   */
  const getFieldsDisabledStatus = () => {
    /**
     * @type {DcaFlagIndex}
     */
    const fieldsDisabled = {};
    dcaAllIndexes.forEach((index) => {
      let disabled = false;
      if (dcaExecutionIndex[index] || isReadOnly) {
        disabled = true;
      }

      fieldsDisabled[composeTargetPropertyName("rebuyPercentage", index)] = disabled;
      fieldsDisabled[composeTargetPropertyName("targetPricePercentage", index)] = disabled;
    });

    return fieldsDisabled;
  };

  /**
   * Effects for when rebuy units change.
   *
   * This is not tied to any input due to the fact that this is derived from
   * position size and price.
   *
   * @param {string} targetId Target group ID.
   * @returns {boolean} true if validation pass, false otherwise.
   */
  const validateUnits = (targetId) => {
    const positionSize = getEntrySizeQuote();
    const rebuyPercentage = getTargetPropertyValue("rebuyPercentage", targetId);
    const rebuyPositionSize = positionSize * (rebuyPercentage / 100);
    const price = getEntryPrice();
    const targetPricePercentage = getTargetPropertyValue("targetPricePercentage", targetId);
    const targetPrice = price * (1 - targetPricePercentage / 100);

    const units = Math.abs(rebuyPositionSize / targetPrice);
    if (positionSize > 0) {
      return validateUnitsLimits(units, "terminal.dca.limit");
    }

    return true;
  };

  /**
   * Validate target percentage
   * @param {string} targetPricePercentageRaw targetPricePercentage value
   * @returns {boolean|string} true if validation pass, error message otherwise.
   */
  const validateDCAPriceLimit = (targetPricePercentageRaw) => {
    const price = getEntryPrice();
    const targetPricePercentage = parseFloat(targetPricePercentageRaw);
    const targetPrice = calculateDcaPrice(price, targetPricePercentage);
    return validateTargetPriceLimits(targetPrice, "terminal.dca.limit");
  };

  /**
   * Validate DCA Units Cost limits
   * @param {string} targetId targetId
   * @returns {boolean|string} true if validation pass, error message otherwise.
   */
  const validateUnitCostLimits = (targetId) => {
    const positionSize = getEntrySizeQuote();
    const rebuyPercentage = getTargetPropertyValue("rebuyPercentage", targetId);
    const rebuyPositionSize = positionSize * (rebuyPercentage / 100);
    if (positionSize > 0) {
      return validateCostLimits(rebuyPositionSize, "terminal.dca.limit");
    }

    return true;
  };

  /**
   * Compose dynamic target property errors.
   *
   * @param {string} propertyName Property base name.
   * @param {string} targetId Target index ID.
   * @returns {JSX.Element|null} Errors JSX element.
   */
  const displayTargetFieldErrors = (propertyName, targetId) => {
    const targetProperty = composeTargetPropertyName(propertyName, targetId);
    if (errors[targetProperty]) {
      return <span className="errorText">{errors[targetProperty].message}</span>;
    }

    return null;
  };

  const initValuesFromPositionEntity = () => {
    if (positionEntity) {
      // Sync any DCA increase update with local state.
      if (!isEqual(activeDcaIncreaseIndexes, dcaIncreaseIndexes)) {
        setActiveDCAIncreaseIndexes(dcaIncreaseIndexes);
      }

      dcaAllIndexes.forEach((index) => {
        const profitTarget = positionEntity.reBuyTargets[Number(index)];
        const triggerPercentage = formatFloat2Dec(profitTarget.triggerPercentage);
        const quantityPercentage = formatFloat2Dec(profitTarget.quantity);
        setTargetPropertyValue("targetPricePercentage", index, triggerPercentage);
        setTargetPropertyValue("rebuyPercentage", index, quantityPercentage);
      });
    }
  };

  useDeepCompareEffect(() => {
    if (expanded) {
      initValuesFromPositionEntity();
      chainedPriceUpdates();
    }
  }, [expanded, rebuyTargets]);

  const chainedPriceUpdates = () => {
    if (expanded) {
      cardinalityRange.forEach((targetId) => {
        const currentValue = getTargetPropertyValue("targetPricePercentage", targetId);
        const newValue = formatFloat2Dec(Math.abs(currentValue));
        const sign = entryType === "LONG" ? "-" : "";

        if (isNaN(currentValue)) {
          setTargetPropertyValue("targetPricePercentage", targetId, sign);
        } else {
          setTargetPropertyValue("targetPricePercentage", targetId, `${sign}${newValue}`);

          const targetPercentageProperty = composeTargetPropertyName(
            "targetPricePercentage",
            targetId,
          );

          // Validate only when not yet executed.
          if (!dcaExecutionIndex[targetId] && dirtyFields[targetPercentageProperty]) {
            trigger(targetPercentageProperty);
          }
        }
      });
    }
  };

  useEffect(chainedPriceUpdates, [cardinality, entryType, strategyPrice]);

  // Automatically expand/collpase panel depending on dca orders amount.
  const autoExpandCollapse = () => {
    setExpanded(Boolean(dcaAllIndexes.length));
  };
  useEffect(autoExpandCollapse, [dcaAllIndexes.length]);

  const chainedUnitsUpdates = () => {
    const rebuyPercentageProperty = composeTargetPropertyName("rebuyPercentage", 1);

    if (
      expanded &&
      cardinality > 0 &&
      !dcaExecutionIndex["1"] &&
      dirtyFields[rebuyPercentageProperty]
    ) {
      trigger(rebuyPercentageProperty);
    }
  };

  useEffect(chainedUnitsUpdates, [expanded, strategyPositionSize]);

  const emptyFieldsWhenCollapsed = () => {
    if (!expanded) {
      cardinalityRange.forEach((targetId) => {
        clearErrors(composeTargetPropertyName("targetPricePercentage", targetId));
        clearErrors(composeTargetPropertyName("rebuyPercentage", targetId));
        setValue(composeTargetPropertyName("targetPricePercentage", targetId), "");
      });
    }
  };

  useEffect(emptyFieldsWhenCollapsed, [expanded]);
  const dcaExecutionIndex = getDcaExecutionIndex();
  const fieldsDisabled = getFieldsDisabledStatus();

  /**
   * Display DCA target group.
   *
   * @param {string} targetId Target index.
   * @returns {JSX.Element} Target element.
   */
  const displayDcaTarget = (targetId) => {
    // Not disabled and DCA within increment index range.
    const index = parseInt(targetId);
    const showRemove =
      !fieldsDisabled[composeTargetPropertyName("targetPricePercentage", targetId)] &&
      targetId !== cardinalityRange[cardinalityRange.length - 1];
    return (
      <Box className="targetGroup" data-target-id={targetId} key={`target${targetId}`}>
        <Box className="targetPrice" display="flex" flexDirection="row" flexWrap="wrap">
          <HelperLabel descriptionId="terminal.dca.help" labelId="terminal.target" />
          <DCATargetStatus
            dcaTarget={rebuyTargets[Number(targetId)] || null}
            labelId="terminal.status"
          />
          <Box alignItems="center" display="flex">
            <OutlinedInput
              className="outlineInput"
              disabled={
                fieldsDisabled[composeTargetPropertyName("targetPricePercentage", targetId)]
              }
              error={!!errors[composeTargetPropertyName("targetPricePercentage", targetId)]}
              inputRef={register(
                fieldsDisabled[composeTargetPropertyName("targetPricePercentage", targetId)]
                  ? null
                  : {
                      validate: {
                        percentage: (value) =>
                          lessThan(value, 0, entryType, "terminal.dca.valid.pricepercentage"),
                        limit: validateDCAPriceLimit,
                      },
                    },
              )}
              name={composeTargetPropertyName("targetPricePercentage", targetId)}
            />
            <div className="currencyBox">%</div>
          </Box>
          {displayTargetFieldErrors("targetPricePercentage", targetId)}
          <HelperLabel descriptionId="terminal.rebuy.help" labelId="terminal.rebuy" />
          <Box alignItems="center" display="flex">
            <OutlinedInput
              className="outlineInput"
              disabled={fieldsDisabled[composeTargetPropertyName("rebuyPercentage", targetId)]}
              error={!!errors[composeTargetPropertyName("rebuyPercentage", targetId)]}
              inputRef={register(
                fieldsDisabled[composeTargetPropertyName("rebuyPercentage", targetId)]
                  ? null
                  : {
                      validate: {
                        positive: (value) =>
                          value > 0 ||
                          formatMessage({
                            id: "terminal.dca.valid.unitspercentage",
                          }),
                        limit: () => validateUnits(targetId),
                        cost: () => validateUnitCostLimits(targetId),
                      },
                    },
              )}
              name={composeTargetPropertyName("rebuyPercentage", targetId)}
            />
            <div className="currencyBox">%</div>
          </Box>
        </Box>
        {displayTargetFieldErrors("rebuyPercentage", targetId)}
        {showRemove && (
          <Box className="targetActions" display="flex" flexDirection="row" flexWrap="wrap">
            <Button
              className="removeTarget"
              data-target-id={index}
              onClick={index >= 1000 ? handleDcaIncreaseRemove : handleTargetRemove}
            >
              <RemoveCircle />
              <FormattedMessage id="terminal.target.remove" />
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box className={`panel dcaPanel ${expandClass}`}>
      <Box alignItems="center" className="panelHeader" display="flex" flexDirection="row">
        {!isClosed && (
          <Switch checked={expanded} onChange={(e) => setExpanded(e.target.checked)} size="small" />
        )}
        <Box alignItems="center" className="title" display="flex" flexDirection="row">
          <Typography variant="h5">
            <FormattedMessage id="terminal.dca" />
          </Typography>
        </Box>
      </Box>
      {expanded && (
        <Box
          className="panelContent"
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-around"
        >
          {cardinalityRange.map((targetId) => displayDcaTarget(targetId))}
          <Box className="targetActions" display="flex" flexDirection="row" flexWrap="wrap">
            {!disableRemoveAction && (
              <Button className="removeTarget" onClick={handleTargetRemove}>
                <RemoveCircle />
                <FormattedMessage id="terminal.target.remove" />
              </Button>
            )}
            {!isReadOnly && (
              <Button className="addTarget" onClick={handleTargetAdd}>
                <AddCircle />
                <FormattedMessage id="terminal.target.add" />
              </Button>
            )}
          </Box>
          {activeDcaIncreaseIndexes.length ? (
            <Typography className="callout1 increaseDCATitle">
              <FormattedMessage id="terminal.dca.increase" />
            </Typography>
          ) : null}
          {activeDcaIncreaseIndexes.map((targetId) => displayDcaTarget(targetId))}
        </Box>
      )}
    </Box>
  );
};

export default React.memo(DCAPanel);
