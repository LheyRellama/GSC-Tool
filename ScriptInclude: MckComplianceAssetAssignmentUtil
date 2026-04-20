/**
 * Script Include: MckComplianceAssetAssignmentUtil
 * Scope: GSC tool (Compliance Asset Update — GSC path)
 * Client callable: true
 * Accessible from: All application scopes (adjust per governance)
 *
 * PURPOSE:
 *   Exposes system property values to catalog client scripts (browser cannot call gs.getProperty).
 *
 * SYSTEM PROPERTIES — create in System Properties [sys_properties]:
 *
 *   mck.asset_assign.sim_permanent_loan_days
 *     Suggested value: 180
 *     Description: Calendar days added to the assignment date for loan end date when model
 *                  category is SIM-type and assignment type is Permanent (Compliance Asset Update).
 *
 *   mck.asset_assign.sim_model_category_sys_id_list
 *     Suggested value: (instance-specific — sys_ids from cmdb_model_category for SIM, SIM Profile, etc.)
 *     Description: Comma-separated sys_ids for alm_hardware.model_category reference values that count
 *                  as SIM family. Compared to the field value (reference sys_id) on the client and server.
 *
 *   mck.asset_assign.assignment_type_permanent_display
 *     Suggested value: Permanent
 *     Description: Display (or stored value) for the Permanent choice on catalog variable
 *                  new_assignment_type; used to detect Permanent in client script.
 */

var MckComplianceAssetAssignmentUtil = Class.create();
MckComplianceAssetAssignmentUtil.prototype = Object.extendsObject(AbstractAjaxProcessor, {

    /**
     * Returns JSON string for client: loanDays, modelCategorySysIdList, permanentAssignmentDisplay
     */
    getSimPermanentConfig: function() {
        var loanDaysPropertyName = 'mck.asset_assign.sim_permanent_loan_days';
        var categoryListPropertyName = 'mck.asset_assign.sim_model_category_sys_id_list';
        var permanentDisplayPropertyName = 'mck.asset_assign.assignment_type_permanent_display';

        var defaultLoanDays = '180';
        var defaultCategorySysIdList = '';
        var defaultPermanentDisplay = 'Permanent';

        var loanDays = gs.getProperty(loanDaysPropertyName, defaultLoanDays);
        var modelCategorySysIdList = gs.getProperty(categoryListPropertyName, defaultCategorySysIdList);
        var permanentAssignmentDisplay = gs.getProperty(permanentDisplayPropertyName, defaultPermanentDisplay);

        var payload = {
            loanDays: loanDays,
            modelCategorySysIdList: modelCategorySysIdList,
            permanentAssignmentDisplay: permanentAssignmentDisplay
        };

        return JSON.stringify(payload);
    },

    type: 'MckComplianceAssetAssignmentUtil'
});
