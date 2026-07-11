export const calculateMaintenance = (
    builtUpArea,
    maintenanceRate
) => {
    const area = Number(builtUpArea) || 0;
    const rate = Number(maintenanceRate) || 0;

    return Number((area * rate).toFixed(2));
};