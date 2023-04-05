import { Model } from "@/model/utils";
import { Catalog, InterfaceWithModels, Item } from "@/types";
import { Map } from "immutable";

// Note: Much of this was generated by this file:
// https://observablehq.com/d/98cbe0073226a5f9

function getCatalog(): Catalog {
  const items: Item[] = [
    {
      id: "funder_openphil_2020",
      clusterId: "funder",
      name: "Open Philanthropy - 2020 (longtermism)",
      description:
        "The marginal value of $1, from Open Philanthropy longtermism, in the year 2020",
    },
    {
      id: "funder_openphil_2023",
      clusterId: "funder",
      name: "Open Philanthropy - 2023 (longtermism)",
      description:
        "The marginal value of $1, from Open Philanthropy longtermism, in the year 2023",
    },
    {
      id: "funder_eafund_ltff_2020",
      clusterId: "funder",
      name: "Long-Term Future Fund (EA Funds) - 2020",
      description:
        "The marginal value of $1, from Long-Term Future Fund (EA Funds), in the year 2020",
    },
    {
      id: "funder_eafund_ltff_2023",
      clusterId: "funder",
      name: "Long-Term Future Fund (EA Funds) - 2023",
      description:
        "The marginal value of $1, from Long-Term Future Fund (EA Funds), in the year 2023",
    },
    {
      id: "funder_eafund_animal_welfare_2020",
      clusterId: "funder",
      name: "Animal Fund (EA Funds) - 2020",
      description:
        "The marginal value of $1, from Long-Term Future Fund (EA Funds), in the year 2020",
    },
    {
      id: "funder_eafund_animal_welfare_2023",
      clusterId: "funder",
      name: "Animal Fund (EA Funds) - 2023",
      description:
        "The marginal value of $1, from Long-Term Future Fund (EA Funds), in the year 2023",
    },
    {
      id: "funder_eafund_ea_infrastructure_2020",
      clusterId: "funder",
      name: "EA Infrastructure Fund (EA Funds) - 2020",
      description:
        "The marginal value of $1, from EA Infrastructure Fund (EA Funds), in the year 2020",
    },
    {
      id: "funder_eafund_ea_infrastructure_2023",
      clusterId: "funder",
      name: "EA Infrastructure Fund (EA Funds) - 2023",
      description:
        "The marginal value of $1, from EA Infrastructure Fund (EA Funds), in the year 2023",
    },
    {
      id: "funder_eafund_globalhealth_2020",
      clusterId: "funder",
      name: "Global Health and Development (EA Funds) - 2020",
      description:
        "The marginal value of $1, from Global Health and Development (EA Funds), in the year 2020. Consider flow-though impacts, like longtermist benefits.",
    },
    {
      id: "funder_eafund_globalhealth_2020_direct",
      clusterId: "funder",
      name: "Global Health and Development (EA Funds) (Direct Impacts) - 2020",
      description:
        "The marginal value of $1, from Global Health and Development (EA Funds), in the year 2020. Only consider direct impacts.",
    },
    {
      id: "qaly_human",
      clusterId: "sentient_welfare",
      name: "1 Human QALY",
      description: "",
    },
    {
      id: "life_human",
      clusterId: "sentient_welfare",
      name: "1 Average Human Life",
      description: "",
    },
    {
      id: "qaly_salmon",
      clusterId: "sentient_welfare",
      name: "1 Salmon QALY",
    },
    {
      id: "qaly_chicken",
      clusterId: "sentient_welfare",
      name: "1 Chicken QALY",
    },
    {
      id: "life_chicken",
      clusterId: "sentient_welfare",
      name: "1 Chicken Life",
    },
    {
      id: "qaly_cow",
      clusterId: "sentient_welfare",
      name: "1 Cow QALY",
    },
    {
      id: "life_cow",
      clusterId: "sentient_welfare",
      name: "1 Cow Life",
    },
    {
      id: "macrovariable_microdoom",
      clusterId: "macrovariables",
      name: "1 Microdoom",
    },
    {
      id: "macrovariable_microtopia",
      clusterId: "macrovariables",
      name: "1 Microtopia",
      description: "",
    },
    {
      id: "macrovariable_universal_microtopia",
      clusterId: "macrovariables",
      name: "1 Universal Microtopia",
    },
    {
      id: "macrovariable_microhell",
      clusterId: "macrovariables",
      name: "1 Microhell",
      description: "",
    },
    {
      id: "macrovariable_universal_microhell",
      clusterId: "macrovariables",
      name: "1 Universal Microhell",
      description: "",
    },
  ];

  return {
    id: "macrovariables",
    title: "Macrovariables",
    items,
    clusters: {
      macrovariables: {
        name: "macrovariables",
        color: "#DB828C",
      },
      funder: {
        name: "funder",
        color: "#3B42aC",
      },
      sentient_welfare: {
        name: "Sentient Welfare",
        color: "#5Bc28C",
      },
    },
  };
}

function getTextModel(): Model {
  return {
    id: "Macrovariables",
    title: "Macrovariables",
    author: "Ozzie Gooen",
    mode: "text",
    code: `
    ss(t) = SampleSet.fromDist(t)
    longtermism_2020_to_2023 = ss(0.8 to 1.6)
    animals_2020_to_2023 = ss(0.7 to 1.15)
    
    ltff_to_openphil = ss(0.7 to 2.2)
    ea_to_longtermism = ss(0.1 to 3)

    average_qaly_per_year = ss(0.7 to 0.9)
    cow_qalys_per_human = ss(0.1 to 0.6)

    animals = {
      human: {qaly: mx(1), lifespan: (ss(70 to 75))},
      cow: {qaly: cow_qalys_per_human, lifespan: (ss(17 to 20))},
      chicken: {qaly: cow_qalys_per_human * ss(0.1 to 0.4), lifespan: ss(3.5 to 4.5)},
      salmon: {qaly: cow_qalys_per_human * (0.01 to 0.3), lifespan: ss(1.5 to 2)}
    }
    
    qaly_human = animals.human.qaly
    qaly_chicken = animals.chicken.qaly

    animal_el(animal, el) = animals[animal][el]
    animal_saved_life_value(animal) = animal_el(animal, "qaly") * animal_el(animal, "lifespan") * average_qaly_per_year 

    qaly_to_utopia = ss(animal_el("human", "qaly") * (10E18 to 10E50))
    utopia_to_hell = ss(-(.01 to 10000))
    universal_to_local_utopia_or_hell = 0.0000001 to 0.5

    macrovariable_microtopia = qaly_to_utopia * (1/1M)
    macrovariable_microhell = utopia_to_hell * macrovariable_microtopia

    macrovariable_universal_microtopia = macrovariable_microtopia * (1/universal_to_local_utopia_or_hell)
    macrovariable_microdoom = -1 * macrovariable_microtopia * ss(0.1 to 0.6)

    macrovariable_universal_microhell = macrovariable_microhell * (1/universal_to_local_utopia_or_hell)

    dollars_for_OP_longtermism_to_save_one_deci_utopia = ss(100B to 10000T)
    dollars_for_OP_longtermism_to_save_one_microtopia = (dollars_for_OP_longtermism_to_save_one_deci_utopia / 100k) * (10 to 100) // convert to mTopia, then add factor for more efficient returns before one decaUtopia.
    longterm_discount_rate = ss(0.00001 to 0.8)

    //Key variables
    expected_positive_openphil_2020_impact = macrovariable_microtopia * longterm_discount_rate * 1/dollars_for_OP_longtermism_to_save_one_microtopia 
    potential_impact_if_negative =  ss(-1*(0.01 to 0.4))
    funder_openphil_2020 = mx(expected_positive_openphil_2020_impact, potential_impact_if_negative * expected_positive_openphil_2020_impact, [0.7, 0.3])
    funder_openphil_2023 = funder_openphil_2020 * longtermism_2020_to_2023
    
    funder_eafund_ltff_2020 = funder_openphil_2020 * ltff_to_openphil
    funder_eafund_ltff_2023 = funder_eafund_ltff_2020 * longtermism_2020_to_2023

    //Key variables
    animal_or_human_to_1_dollar_OP_for_longtermism = ss(1000 to 1M) // How many dollars would longtermists trade for the longtermist benefits of giving to animals/humans, effectively? My guess is that $1M to the EA Animal charities will give some kind of longtermist benefit or another - worth at least $1 to OP longtermism.

    saved_salmon_remaining_QALYS = 1 to 5
    funder_eafund_animal_welfare_2020 = animal_saved_life_value("cow") * (1 / (ss(10 to 1000))) + (1/animal_or_human_to_1_dollar_OP_for_longtermism) * funder_openphil_2020
    funder_eafund_animal_welfare_2023 = funder_eafund_animal_welfare_2020 * animals_2020_to_2023
    saved_human_remaining_QALYS = 30 to 80


    funder_eafund_globalhealth_2020_direct = animal_saved_life_value("human") * (1 / (5000 to 20000))
    funder_eafund_globalhealth_2020 = funder_eafund_globalhealth_2020_direct + (1/animal_or_human_to_1_dollar_OP_for_longtermism) * funder_openphil_2020

    funder_eafund_ea_infrastructure_2020 = (funder_eafund_ltff_2020 * ss(0.1 to 0.6)) + (funder_eafund_globalhealth_2020 * ss(0.01 to 0.5)) + (funder_eafund_animal_welfare_2020 * ss(0.01 to 0.5))
    funder_eafund_ea_infrastructure_2023 = funder_eafund_ea_infrastructure_2020 * ss(0.8 to 1.4)

    vars = {
        funder_openphil_2020: funder_openphil_2020,
        funder_openphil_2023: funder_openphil_2023,
        funder_eafund_ltff_2020: funder_eafund_ltff_2020,
        funder_eafund_ltff_2023: funder_eafund_ltff_2023,
        funder_eafund_animal_welfare_2020: funder_eafund_animal_welfare_2020,
        funder_eafund_animal_welfare_2023: funder_eafund_animal_welfare_2023,
        funder_eafund_ea_infrastructure_2020: funder_eafund_ea_infrastructure_2020,
        funder_eafund_ea_infrastructure_2023: funder_eafund_ea_infrastructure_2023,
        funder_eafund_globalhealth_2020: funder_eafund_globalhealth_2020,
        funder_eafund_globalhealth_2020_direct: funder_eafund_globalhealth_2020_direct,
        qaly_human: animals.human.qaly,
        qaly_chicken: animals.chicken.qaly,
        qaly_cow: animals.cow.qaly,
        qaly_salmon: animals.salmon.qaly,
        life_human: animal_saved_life_value("human"),
        life_chicken: animal_saved_life_value("chicken"),
        life_cow: animal_saved_life_value("cow"),
        macrovariable_microdoom: macrovariable_microdoom,
        macrovariable_universal_microtopia: macrovariable_universal_microtopia,
        macrovariable_microtopia: macrovariable_microtopia,
        macrovariable_microhell: macrovariable_microhell,
        macrovariable_universal_microhell: macrovariable_universal_microhell
    }

    fn(a,b) = vars[a] / vars[b]
`,
  };
}

export function getMacrovariables(): InterfaceWithModels {
  return {
    catalog: getCatalog(),
    models: Map([getTextModel()].map((m) => [m.id, m])),
  };
}
