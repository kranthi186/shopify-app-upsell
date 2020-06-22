import React, { Component } from 'react';
import { Card, Icon, Tooltip } from '@shopify/polaris';
import { I18n } from 'react-redux-i18n';
import { CashDollarMajorMonotone } from '@shopify/polaris-icons';
import './UpsellStatistics.scss';
import { getUpsellStatistics } from '../../redux/actions';

const store_orders = 500;
const store_orders_total = 5000;

class UpsellStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total_revenue: 0,
      roi: 0,
      average_order_value: 0,
      average_order: 0,
    };
  }

  async componentDidMount() {
    const data = await getUpsellStatistics();


    this.setState({
      total_revenue: data.revenue,
      roi: data.revenue / data.user_payment * 100,
      average_order_value: data.upsell_orders_total / data.upsell_orders,
      average_order: (data.upsell_orders_total / data.upsell_orders) - (data.store_orders_total / data.store_orders),
    });

    // this.setState(data);

    if(data.revenue > 0){
      if(window.fcWidget){
        window.fcWidget.track('has_sales');
      }
    }
  }

  render() {
    const { total_revenue, roi, average_order_value, average_order } = this.state;
    const { default_money_format } = this.props;
    return (
      <Card
        title={(
          <div className="Icon-card-title Polaris-Heading">
            <Icon source={CashDollarMajorMonotone} color="inkLighter" /> {I18n.t('Upsell performance')}
          </div>
        )}
        sectioned
      >
        <div className="UpsellStatistics-content">
          <h2>{I18n.t('Ultimate Upsell impact on your store')}</h2>
          <div className="static-total">
            <Tooltip light content={`Total revenue is the ${default_money_format.replace(/\{\{.*?\}\}/, "").replace(/<[^>]*>/g, "")} sum of all orders generated by Honeycomb`} preferredPosition="above">
              <div className="item border-r">
                <div className="value">
                {default_money_format
                  .replace(/\{\{.*?\}\}/, total_revenue.toFixed(2))
                  .replace(/<[^>]*>/g, "")}</div>
                <div className="title">{I18n.t('Total revenue')}</div>
              </div>
            </Tooltip>
            {/* {roi > 100 && <Tooltip light content={I18n.t('Return of investment is calculated by your app payouts in comparison to upsell generated revenues')} preferredPosition="above">
              <div className={classNames('item', { 'border-r': average_order })}>
                <div className="value">{isFinite(roi.toFixed(2))? `%${roi.toFixed(2)}` : '∞'}</div>
                <div className="title">{I18n.t('ROI')}</div>
              </div>
            </Tooltip>} */}
            {average_order > 0 &&<Tooltip light content={I18n.t('This is the avarage upsell order value in comparison to your store average order value')} preferredPosition="above">
              <div className="item">
                <div className="value">
                {default_money_format
                  .replace(/\{\{.*?\}\}/, average_order_value.toFixed(2))
                  .replace(/<[^>]*>/g, "")}
                  </div>
                <div className="title">{I18n.t('Average Order Value')}</div>
                <div className="aov">🎉 <div>
                {default_money_format
                  .replace(/\{\{.*?\}\}/, average_order.toFixed(2))
                  .replace(/<[^>]*>/g, "")}
                  </div> more than store AOV</div>
              </div>
            </Tooltip>}
          </div>
        </div>
      </Card>
    );
  }
}

export default UpsellStatistics;
